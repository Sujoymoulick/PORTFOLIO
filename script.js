
    document.addEventListener('DOMContentLoaded', function() {
      // Mobile menu toggle
      const menuButton = document.getElementById('menu-button');
      const mobileMenu = document.getElementById('mobile-menu');
      menuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });

      // Smooth scrolling for navigation links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
          });
          if (!mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
          }
        });
      });

      // Certificates carousel drag-to-scroll functionality
      const carousel = document.getElementById('certificates-carousel');
      if (carousel) {
        let isDown = false;
        let startX;
        let scrollLeft;

        carousel.addEventListener('mousedown', (e) => {
          isDown = true;
          carousel.classList.add('active');
          startX = e.pageX - carousel.offsetLeft;
          scrollLeft = carousel.scrollLeft;
        });

        carousel.addEventListener('mouseleave', () => {
          isDown = false;
          carousel.classList.remove('active');
        });

        carousel.addEventListener('mouseup', () => {
          isDown = false;
          carousel.classList.remove('active');
        });

        carousel.addEventListener('mousemove', (e) => {
          if (!isDown) return;
          e.preventDefault();
          const x = e.pageX - carousel.offsetLeft;
          const walk = (x - startX) * 1.5; // Adjust the multiplier for scroll speed
          carousel.scrollLeft = scrollLeft - walk;
        });
      }

      // Three.js 3D Background Logic
      const canvas = document.getElementById('three-canvas');
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000, 0); // Transparent background

      // Create a 3D object
      const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
      const material = new THREE.MeshPhysicalMaterial({
        color: 0x8b5cf6, // purple
        roughness: 0.1,
        metalness: 0.5,
        clearcoat: 1,
        clearcoatRoughness: 0.2
      });
      const torusKnot = new THREE.Mesh(geometry, material);
      scene.add(torusKnot);

      // Add ambient and point lighting
      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);
      const pointLight = new THREE.PointLight(0xffffff, 1);
      pointLight.position.set(50, 50, 50);
      scene.add(pointLight);

      camera.position.z = 30;

      // Mouse position for interaction
      const mouse = new THREE.Vector2();
      window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      });

      // Handle window resizing
      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      // Animation loop
      function animate() {
        requestAnimationFrame(animate);

        // Animate the object based on mouse position
        torusKnot.rotation.y = mouse.x * 0.5;
        torusKnot.rotation.x = mouse.y * 0.5;

        // Add a slight automatic rotation for continuous movement
        torusKnot.rotation.z += 0.005;

        renderer.render(scene, camera);
      }

      // Start the animation on window load
      window.onload = function() {
        animate();
      };
    });
