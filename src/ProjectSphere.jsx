import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// All of the interaction's physical and visual tuning lives here.
export const SPHERE_CONFIG = {
  radius: 1.45,
  cardWidth: 0.46,
  cardHeight: 0.58,
  cameraDistance: 8.2,
  dragSensitivity: 0.0042,
  wheelSensitivity: 0.00055,
  wheelInteractionZone: 0.46,
  idleSpeedMin: 0.0005,
  idleSpeedMax: 0.0012,
  idleResumeDelay: 0,
  idleDirectionMinTime: 4200,
  idleDirectionMaxTime: 9000,
  rotationLerp: 0.14,
  inertia: 0.93,
  minScale: 0.52,
  maxScale: 1.18,
  minOpacity: 0.2,
  pixelRatioCap: 1.75,
};

const ProjectSphere = ({ projects, onProjectSelect, onProjectOpen, onReady }) => {
  const containerRef = useRef(null);
  const selectRef = useRef(onProjectSelect);
  const openRef = useRef(onProjectOpen);
  const readyRef = useRef(onReady);

  useEffect(() => { selectRef.current = onProjectSelect; }, [onProjectSelect]);
  useEffect(() => { openRef.current = onProjectOpen; }, [onProjectOpen]);
  useEffect(() => { readyRef.current = onReady; }, [onReady]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !projects.length) return undefined;

    const config = SPHERE_CONFIG;
    const allowAmbientMotion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
    camera.position.z = config.cameraDistance;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, config.pixelRatioCap));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = 'project-sphere__canvas';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    container.appendChild(renderer.domElement);

    const sphere = new THREE.Group();
    scene.add(sphere);

    const cardGeometry = new THREE.PlaneGeometry(config.cardWidth, config.cardHeight, 1, 1);
    const frameGeometry = new THREE.EdgesGeometry(cardGeometry);
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');
    const cards = [];
    let completedTextures = 0;
    let didReportReady = false;

    const reportReady = () => {
      if (didReportReady) return;
      didReportReady = true;
      readyRef.current?.();
    };
    const textureComplete = () => {
      completedTextures += 1;
      if (completedTextures === projects.length) reportReady();
    };

    // A golden-angle distribution avoids rows and keeps any project count balanced.
    projects.forEach((project, index) => {
      const progress = (index + .5) / projects.length;
      const y = 1 - progress * 2;
      const radial = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = index * Math.PI * (3 - Math.sqrt(5));
      const normal = new THREE.Vector3(Math.cos(theta) * radial, y, Math.sin(theta) * radial);

      const texture = textureLoader.load(project.image, (loadedTexture) => {
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        const imageAspect = loadedTexture.image.width / loadedTexture.image.height;
        const cardAspect = config.cardWidth / config.cardHeight;
        if (imageAspect > cardAspect) {
          loadedTexture.repeat.x = cardAspect / imageAspect;
          loadedTexture.offset.x = (1 - loadedTexture.repeat.x) / 2;
        } else {
          loadedTexture.repeat.y = imageAspect / cardAspect;
          loadedTexture.offset.y = (1 - loadedTexture.repeat.y) / 2;
        }
        loadedTexture.needsUpdate = true;
        textureComplete();
      }, undefined, textureComplete);
      texture.colorSpace = THREE.SRGBColorSpace;

      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: texture,
        transparent: true,
        opacity: .7,
        side: THREE.DoubleSide,
        depthWrite: false,
        toneMapped: false,
      });
      const card = new THREE.Mesh(cardGeometry, material);
      card.position.copy(normal).multiplyScalar(config.radius);
      card.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      card.userData = { index, normal, targetScale: 1 };

      const frame = new THREE.LineSegments(frameGeometry, new THREE.LineBasicMaterial({ color: 0xf06d51, transparent: true, opacity: .18 }));
      frame.position.z = .006;
      card.add(frame);
      sphere.add(card);
      cards.push(card);
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(4, 4);
    const drag = { active: false, id: null, x: 0, y: 0, distance: 0 };
    const motion = {
      currentX: -.12,
      currentY: .18,
      targetX: -.12,
      targetY: .18,
      velocityX: 0,
      velocityY: 0,
      idleX: 0,
      idleY: 0,
      idleTargetX: .00008,
      idleTargetY: .00016,
    };
    const worldPosition = new THREE.Vector3();
    const sphereWorldQuaternion = new THREE.Quaternion();
    const billboardQuaternion = new THREE.Quaternion();
    let hovered = null;
    let closestIndex = -1;
    let animationFrame = 0;
    let readyTimer = window.setTimeout(reportReady, 1600);
    let lastInteraction = performance.now();
    let nextIdleDirection = lastInteraction + config.idleDirectionMinTime;

    const chooseIdleDirection = (now) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = THREE.MathUtils.lerp(config.idleSpeedMin, config.idleSpeedMax, Math.random());
      motion.idleTargetX = Math.sin(angle) * speed;
      motion.idleTargetY = Math.cos(angle) * speed;
      nextIdleDirection = now + THREE.MathUtils.lerp(config.idleDirectionMinTime, config.idleDirectionMaxTime, Math.random());
    };

    const updatePointer = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const pointerDown = (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      drag.active = true;
      drag.id = event.pointerId;
      drag.x = event.clientX;
      drag.y = event.clientY;
      drag.distance = 0;
      motion.velocityX = 0;
      motion.velocityY = 0;
      lastInteraction = performance.now();
      renderer.domElement.setPointerCapture(event.pointerId);
      container.classList.add('is-dragging');
    };

    const pointerMove = (event) => {
      updatePointer(event);
      lastInteraction = performance.now();
      if (!drag.active || event.pointerId !== drag.id) return;
      const deltaX = event.clientX - drag.x;
      const deltaY = event.clientY - drag.y;
      drag.x = event.clientX;
      drag.y = event.clientY;
      drag.distance += Math.abs(deltaX) + Math.abs(deltaY);
      motion.velocityY = deltaX * config.dragSensitivity;
      motion.velocityX = deltaY * config.dragSensitivity;
      motion.targetY += motion.velocityY;
      motion.targetX += motion.velocityX;
    };

    const pointerUp = (event) => {
      if (!drag.active || event.pointerId !== drag.id) return;
      drag.active = false;
      container.classList.remove('is-dragging');
      if (renderer.domElement.hasPointerCapture(event.pointerId)) renderer.domElement.releasePointerCapture(event.pointerId);
      if (drag.distance < 7) {
        updatePointer(event);
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(cards, false)[0];
        if (hit) {
          const projectIndex = hit.object.userData.index;
          selectRef.current?.(projectIndex);
          openRef.current?.(projectIndex, { x: event.clientX, y: event.clientY });
        }
      }
    };

    const wheel = (event) => {
      updatePointer(event);
      const isInCenter = Math.abs(pointer.x) <= config.wheelInteractionZone
        && Math.abs(pointer.y) <= config.wheelInteractionZone;
      if (!isInCenter) return;

      event.preventDefault();
      lastInteraction = performance.now();
      const normalizedDelta = THREE.MathUtils.clamp(
        event.deltaY * (event.deltaMode === 1 ? 18 : 1),
        -120,
        120,
      );
      const impulse = normalizedDelta * config.wheelSensitivity;
      motion.velocityX += impulse;
      motion.targetX += impulse * 1.8;
    };

    renderer.domElement.addEventListener('pointerdown', pointerDown);
    renderer.domElement.addEventListener('pointermove', pointerMove);
    renderer.domElement.addEventListener('pointerup', pointerUp);
    renderer.domElement.addEventListener('pointercancel', pointerUp);
    renderer.domElement.addEventListener('wheel', wheel, { passive: false });

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const animate = () => {
      const now = performance.now();
      if (!drag.active) {
        motion.targetX += motion.velocityX;
        motion.targetY += motion.velocityY;
        motion.velocityX *= config.inertia;
        motion.velocityY *= config.inertia;
        if (Math.abs(motion.velocityX) < .00001) motion.velocityX = 0;
        if (Math.abs(motion.velocityY) < .00001) motion.velocityY = 0;
      }

      const isIdle = allowAmbientMotion && !drag.active && now - lastInteraction > config.idleResumeDelay;
      if (isIdle) {
        if (now >= nextIdleDirection) chooseIdleDirection(now);
        motion.idleX += (motion.idleTargetX - motion.idleX) * .018;
        motion.idleY += (motion.idleTargetY - motion.idleY) * .018;
        motion.targetX += motion.idleX;
        motion.targetY += motion.idleY;
      } else {
        motion.idleX *= .9;
        motion.idleY *= .9;
      }
      motion.currentX += (motion.targetX - motion.currentX) * config.rotationLerp;
      motion.currentY += (motion.targetY - motion.currentY) * config.rotationLerp;
      sphere.rotation.x = motion.currentX;
      sphere.rotation.y = motion.currentY;
      sphere.updateMatrixWorld(true);
      sphere.getWorldQuaternion(sphereWorldQuaternion);
      billboardQuaternion.copy(sphereWorldQuaternion).invert();

      let nearestZ = -Infinity;
      let nearestIndex = 0;
      cards.forEach((card) => {
        // Keep every flat thumbnail parallel to the camera while its position
        // remains attached to the rotating sphere.
        card.quaternion.copy(billboardQuaternion);
        card.getWorldPosition(worldPosition);
        const depth = THREE.MathUtils.clamp((worldPosition.z / config.radius + 1) / 2, 0, 1);
        const easedDepth = depth * depth * (3 - 2 * depth);
        card.userData.targetScale = THREE.MathUtils.lerp(config.minScale, config.maxScale, easedDepth);
        const scale = THREE.MathUtils.lerp(card.scale.x, card.userData.targetScale, .1);
        card.scale.setScalar(scale);
        card.material.opacity = THREE.MathUtils.lerp(config.minOpacity, 1, easedDepth);
        card.material.color.setScalar(THREE.MathUtils.lerp(.48, 1, easedDepth));
        card.renderOrder = Math.round(easedDepth * 100);
        card.children[0].material.opacity = THREE.MathUtils.lerp(.05, .5, easedDepth);
        if (worldPosition.z > nearestZ) { nearestZ = worldPosition.z; nearestIndex = card.userData.index; }
      });
      sphere.updateMatrixWorld(true);

      if (nearestIndex !== closestIndex) {
        closestIndex = nearestIndex;
        selectRef.current?.(closestIndex);
      }

      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(cards, false)[0]?.object || null;
      if (hit !== hovered) {
        hovered = hit;
        container.classList.toggle('has-hover', Boolean(hit));
      }
      cards.forEach((card) => {
        if (card === hovered) card.scale.multiplyScalar(1.04);
      });

      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.clearTimeout(readyTimer);
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', pointerDown);
      renderer.domElement.removeEventListener('pointermove', pointerMove);
      renderer.domElement.removeEventListener('pointerup', pointerUp);
      renderer.domElement.removeEventListener('pointercancel', pointerUp);
      renderer.domElement.removeEventListener('wheel', wheel);
      cards.forEach((card) => {
        card.material.map?.dispose();
        card.material.dispose();
        card.children.forEach((child) => child.material.dispose());
      });
      cardGeometry.dispose();
      frameGeometry.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [projects]);

  return <div ref={containerRef} className="project-sphere" />;
};

export default ProjectSphere;
