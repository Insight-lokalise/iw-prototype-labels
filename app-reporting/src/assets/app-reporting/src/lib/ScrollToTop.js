export const scrollToTopFunc = () => {
	window.scroll({
		top: 0,
		left: 0,
		behavior: 'smooth',
	});
}

// TODO - Check if can be moved to iw-toolkit 
function ScrollToTop() {
	scrollToTopFunc();
	return null
}

export default ScrollToTop;
