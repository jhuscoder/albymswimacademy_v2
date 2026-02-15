// Page loading animation
$(window).on("load", function () {
  if ($(".cover").length) {
    $(".cover").parallax({
      imageSrc: $(".cover").data("image"),
      zIndex: "1",
    });
  }

  $("#preloader").animate(
    {
      opacity: "0",
    },
    5000,
    function () {
      setTimeout(function () {
        $("#preloader").css("visibility", "hidden").fadeOut();
      }, 300);
    },
  );
});

const carousel = document.getElementById("testimonial-carousel");
const dots = document.querySelectorAll("#testimonial-dots .dot");

carousel.addEventListener("scroll", () => {
  const scrollLeft = carousel.scrollLeft;
  const width = carousel.offsetWidth;
  const index = Math.round(scrollLeft / width);

  dots.forEach((dot, i) => {
    if (i === index) {
      dot.classList.add("bg-[#b32138]");
      dot.classList.remove("bg-gray-400");
    } else {
      dot.classList.add("bg-gray-400");
      dot.classList.remove("bg-[#b32138]");
    }
  });
});
