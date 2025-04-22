// Simple parallax effect for header
document.addEventListener("DOMContentLoaded", function () {
	const parallaxHeader = document.querySelector(".parallax-header img");

	if (parallaxHeader && window.innerWidth >= 768) {
		window.addEventListener("scroll", function () {
			const scrollY = window.scrollY;
			parallaxHeader.style.transform = `translateY(${scrollY * 0.3}px)`;
		});
	}
});
