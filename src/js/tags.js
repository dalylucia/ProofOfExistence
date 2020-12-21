;(function () {
    const styles = `<style>
    @import url('https://fonts.googleapis.com/css?family=IBM+Plex+Sans:300&display=swap&text=More%20lik%20ths');
    #ss-collection {
      position: fixed;
      bottom: 20px;
      left: 20px;
      z-index: 10;
      font-family: "IBM Plex sans", "Roboto", sans-serif;
      font-weight: 300;
      text-decoration: none;
      font-display: swap;
      font-size: 15px;
      padding: 0.6em 0.7em 0.7em;
      background-color: #e7edf0;
      color: #8ca9b7;
      line-height: 1;
      border-radius: 0.2em;
      border: 2px solid transparent;
      box-shadow: 2px 2px 5px rgba(0,0,0,0);
      transition-property: color, background, box-shadow;
      transition-duration: 0.25s;
      transition-timing-function: cubic-bezier(0.4,0,0.2,1);
    }
    #ss-collection:hover, #ss-collection:focus {
      background-color: #037DE4;
      color: #fff;
      box-shadow: 2px 5px 18px rgba(0,0,0,0.26);
    }
    #ss-collection:focus {
      outline: none;
      border-color: #46a9fd;
    }
    </style>`;
  
    document.head.insertAdjacentHTML('beforeend', styles);
  })();
  
  const text = document.getElementById('text');
  const list = document.getElementById('list');
  const remove = document.getElementById('remove');
  
  const makeTag = text => {
    let output = `<li class="tags__item"><span class="tags__inner">${text}</span><button type="button" class="tags__remove" aria-label="Remove ${text} tag">&times;</button></li>`;
    list.insertAdjacentHTML('beforeend', output);
  };

  $('input,textarea').focus(function(){
    $(this).removeAttr('placeholder');
  });
  
  /**
     * Add items when typing
     */
  // Only check each time user types space, tab or uses arrows? For performance
  const onInputKeyUp = function (e) {
    console.log(e, this.value);
  
    // Don't allow just space or comma
    if (this.value == ' ' || this.value == ',') {
      this.value = '';
    }
  
    // Comma separate tags
    if (this.value !== '' && e.key === ',') {
      makeTag(this.value.replace(',', ''));
      this.value = '';
    }
  };
  
  /**
     * Remove items if backspacing
     */
  const onInputKeyDown = function (e) {
    console.log(this.value);
    let items = list.children;
  
    if ((e.keyCode == 8 || e.keyCode == 46) && items.length && this.value == '') {
      let lastItem = items[items.length - 1];
      this.value = lastItem.children[0].innerText;
      lastItem.outerHTML = '';
    }
  };
  
  const onEmptyClick = function () {
    list.innerHTML = '';
  };
  
  const deleteTag = function (e) {
    e.preventDefault();
  
    if (e.target !== this && e.target.matches('.tags__remove')) {
      e.target.parentElement.outerHTML = '';
    }
  };
  
  text.addEventListener('keyup', onInputKeyUp, false);
  text.addEventListener('keydown', onInputKeyDown, false);
  
  remove.addEventListener('click', onEmptyClick, false);
  
  list.addEventListener('click', deleteTag);
  