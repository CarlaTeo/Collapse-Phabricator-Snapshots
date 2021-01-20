// ==UserScript==
// @name        Phabricator: collapse snapshots
// @include     https://phabricator.*
// @version     2
// @grant       none
// ==/UserScript==

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function collapseSnapshots() {
  await sleep(5000); //if your internet connection is too slow you might want to increase this value
  let fileSections = document.getElementsByClassName("differential-changeset");
  let mouseEvent = document.createEvent("MouseEvents");
  mouseEvent.initEvent("click", true, true);

  for (let i = 0; i < fileSections.length; ++i) {
    const isSnapshot = fileSections[i].getElementsByTagName("h1")[0].innerText.search("snapshots");

    if(isSnapshot>-1){
      const links = fileSections[i].getElementsByTagName("a");
      const arrLinks = [].slice.call(links);
      const optionsButton = arrLinks.filter(link=> link.innerHTML.search("View Options")>-1);
      optionsButton[0].dispatchEvent(mouseEvent);

      let menuLinksArray = getOptionsFromMenu();

      const isLoading = menuLinksArray.filter(link=> link.innerHTML.search("Can't Toggle Unloaded File")>-1);
      if(isLoading.length){
          optionsButton[0].dispatchEvent(mouseEvent); // close menu
          await sleep(5000); //if your internet connection is too slow you might want to increase this value
          optionsButton[0].dispatchEvent(mouseEvent); // reopen menu
          menuLinksArray = getOptionsFromMenu();
      }

      const collapseOption= menuLinksArray.filter(link=> link.innerHTML.search("Hide Changeset")>-1);
      if(collapseOption.length){
      	collapseOption[0].dispatchEvent(mouseEvent);
      }
    }
  }
}

function getOptionsFromMenu(){
    const menu = document.getElementsByClassName("phuix-dropdown-menu");
    const menuLinks = menu[0].getElementsByTagName("a");
    return [].slice.call(menuLinks);
}

// Waiting for the document to load, even though window.onload will fire before all the file diffs have been loaded
window.onload = collapseSnapshots;
