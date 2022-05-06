export default function openFullscreen() {

  var ua = navigator.userAgent;
  var element = document.documentElement;
  var isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(ua);
  console.log(/Android|webOS|iPhone|iPad|iPod/i.test(ua))
  if (isMobile) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) { /* Safari */
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { /* IE11 */
      element.msRequestFullscreen();
    }
  }
}
