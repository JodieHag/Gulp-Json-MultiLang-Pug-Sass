$(document).ready(function () {
  $('.owl-carousel').owlCarousel({
    loop: true,
    margin: 10,
    autoplay: true,
    autoplayTimeout: 500,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
        loop: true,
      },
      600: {
        items: 2,
        loop: true,
      },
      1000: {
        items: 3,
        loop: true,
      },
    },
  })
})
