let controller;
let slideScene;
let pageScene;

function animateSlides() {
  controller = new ScrollMagic.Controller();

  const sliders = document.querySelectorAll(".slide");
  const nav = document.querySelector(".nav-header");

  sliders.forEach((slide, index, slides) => {
    const revelImg = slide.querySelector(".reveal-img");
    const img = slide.querySelector("img");
    const revealText = slide.querySelector(".reveal-text");

    // gsap.to(revelImg, 1, {x: 100%})
    const slideTl = gsap.timeline({
      defaults: { duration: 1, ease: "power2.inOut" },
    });

    slideTl.fromTo(revelImg, { x: "0%" }, { x: "100%" });
    slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, "-=1"); // -=1 same
    slideTl.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-=0.5");

    gsap.fromTo(nav, { y: "-100%" }, { y: "0%" }, "-=0.75");

    // slide
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
    })
      .setTween(slideTl)
      // .addIndicators({
      //   colorStart: "white",
      //   colorTrigger: "white",
      //   name: "slide",
      // })
      .addTo(controller);

    const pageTl = gsap.timeline();
    let nextSlide = slides.length - 1 === index ? "end" : sliders[index + 1];
    pageTl.fromTo(nextSlide, { y: "0%" }, { y: "50%" });
    pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    pageTl.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5");
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })

      // .addIndicators({
      //   colorStart: "white",
      //   colorTrigger: "white",
      //   name: "page",
      //   indent: 200,
      // })
      .setTween(pageTl)
      .setPin(slide, { pushFollowers: false })
      .addTo(controller);
  });
}

function animateScroll() {
  controller = new ScrollMagic.Controller();
  const sliders = document.querySelectorAll(".detail-slide");

  gsap.fromTo(".first", 1, { x: "100%", opacity: 0 }, { x: "0%", opacity: 1 });

  sliders.forEach((slide, index, sliders) => {
    // TimeLine
    let nextSlide = sliders.length - 1 === index ? "end" : sliders[index + 1];
    let nextImage = nextSlide.querySelector("img");
    const slideTl = gsap.timeline({
      default: { duration: 1, ease: "power2.inOut" },
    });

    // animation
    slideTl.fromTo(slide, { opacity: 1 }, { opacity: 0 });
    slideTl.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, "-=1");
    slideTl.fromTo(nextImage, { x: "50%" }, { x: "0%" });
    // slide Scencs
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      .setTween(slideTl)
      .setPin(slide, { pushFollowers: false })
      .addTo(controller);
  });
}

let mouse = document.querySelector(".cursor");
let burger = document.querySelector(".burger");
function cursor(e) {
  mouse.style.top = e.pageY + "px";
  mouse.style.left = e.pageX + "px";
}

function cursorClick(e) {
  const item = e.target;
  if (item.id === "logo" || item.classList.contains("burger")) {
    mouse.classList.add("nav-active");
  } else {
    mouse.classList.remove("nav-active");
  }

  if (item.classList.contains("explore")) {
    mouse.classList.add("explore-active");
    gsap.to(".title-swipe", 1, { y: "0%" });
    mouse.innerText = "Tap";
  } else {
    mouse.classList.remove("explore-active");
    // gsap.to()
    gsap.to(".title-swipe", 1, { y: "100%" });
    mouse.innerText = "";
  }
}
function showNav(e) {
  if (!e.target.classList.contains("active")) {
    console.log(e.target);
    e.target.classList.add("active");
    gsap.to(".line1", 0.5, { rotate: "45", background: "black", y: 5 });
    gsap.to(".line2", 0.5, { rotate: "-45", background: "black", y: -5 });
    gsap.to("#logo", 1, { color: "black" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(2500px at 100% -10%)" });
  } else {
    e.target.classList.remove("active");
    gsap.to(".line1", 0.5, { rotate: "0", background: "white", y: 0 });
    gsap.to(".line2", 0.5, { rotate: "0", background: "white", y: 0 });
    gsap.to("#logo", 1, { color: "white" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(50px at 100% -10%)" });
  }
}

barba.init({
  views: [
    {
      namespace: "home",
      beforeEnter() {
        animateSlides();
        console.log("dwadwad");
        // logo.href = "./index.html";
      },
      beforeLeave() {
        controller.destory();
        slideScene.destory();
        pageScene.destory();
      },
    },
    {
      namespace: "fashion",
      beforeEnter() {
        animateScroll();
      },
      beforeLeave() {
        controller.destroy();
        slideScene.destory();
        // detailScene.destroy();
      },
    },
  ],
  transitions: [
    {
      leave({ current, next }) {
        let done = this.async();
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });

        tl.fromTo(
          ".swipe",
          0.75,
          { x: "-100%" },
          { x: "0%", onComplete: done },
          "-=0.5"
        );
      },
      enter({ current, next }) {
        let done = this.async();
        window.scrollTo(0, 0);
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

        tl.fromTo(
          ".swipe",
          0.75,
          { x: "0%" },
          {
            x: "100%",
            stagger: 0.5,
            onComplete: done,
          },
          "-=0.5"
        );

        tl.fromTo(
          next.container,
          1,
          { opacity: 0 },
          { opacity: 1, onComplete: done }
        );

        tl.fromTo(
          ".first",
          1,
          { x: "100%", opacity: 0 },
          { x: "0%", opacity: 1 },
          '-=1'
        );

        
      },
    },
  ],
});
burger.addEventListener("click", showNav);
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", cursorClick);
