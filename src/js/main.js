(function () {
    const doc = document.documentElement
  
    doc.classList.remove('no-js')
    doc.classList.add('js')
  
    // Reveal animations
    if (document.body.classList.contains('has-animations')) {
      /* global ScrollReveal */
      const sr = window.sr = ScrollReveal()
  
      sr.reveal('.hero-title, .hero-paragraph, .newsletter-header, .newsletter-form', {
        duration: 1000,
        distance: '40px',
        easing: 'cubic-bezier(0.5, -0.01, 0, 1.005)',
        origin: 'bottom',
        interval: 150
      })
  
      sr.reveal('.bubble-3, .bubble-4, .hero-browser-inner, .bubble-1, .bubble-2', {
        duration: 1000,
        scale: 0.95,
        easing: 'cubic-bezier(0.5, -0.01, 0, 1.005)',
        interval: 150
      })
  
      sr.reveal('.feature', {
        duration: 600,
        distance: '40px',
        easing: 'cubic-bezier(0.5, -0.01, 0, 1.005)',
        interval: 100,
        origin: 'bottom',
        viewFactor: 0.5
      })
    }
  }())
  
   // portfolio
   $('.gallery ul li a').click(function() {
    var itemID = $(this).attr('href');
    $('.gallery ul').addClass('item_open');
    $(itemID).addClass('item_open');
    return false;
  });
  $('.close').click(function() {
    $('.port, .gallery ul').removeClass('item_open');
    return false;
  });
  
  $(".gallery ul li a").click(function() {
    $('html, body').animate({
        scrollTop: parseInt($("#top").offset().top)
    }, 400);
  });
  

function buttonUp(){
    var valux = $('.sb-search-input').val(); 
       valux = $.trim(valux).length;
       if(valux !== 0){
           $('.sb-search-submit').css('z-index','99');
       } else{
           $('.sb-search-input').val(''); 
           $('.sb-search-submit').css('z-index','-999');
       }
}

$(document).ready(function() {
   var submitIcon = $('.sb-icon-search');
   var submitInput = $('.sb-search-input');
   var searchBox = $('.sb-search');
   var isOpen = false;
   
   $(document).mouseup(function(){
       if(isOpen == true){
       submitInput.val('');
       $('.sb-search-submit').css('z-index','-999');
       submitIcon.click();
       }
   });
   
   submitIcon.mouseup(function(){
       return false;
   });
   
   searchBox.mouseup(function(){
       return false;
   });
           
   submitIcon.click(function(){
       if(isOpen == false){
           searchBox.addClass('sb-search-open');
           isOpen = true;
       } else {
           searchBox.removeClass('sb-search-open');
           isOpen = false;
       }
    });

});

// Form
//material contact form animation
$('.contact-form').find('.form-control').each(function() {
    var targetItem = $(this).parent();
    if ($(this).val()) {
      $(targetItem).find('label').css({
        'top': '10px',
        'fontSize': '14px'
      });
    }
  })
  $('.contact-form').find('.form-control').focus(function() {
    $(this).parent('.input-block').addClass('focus');
    $(this).parent().find('label').animate({
      'top': '10px',
      'fontSize': '14px'
    }, 300);
  })
  $('.contact-form').find('.form-control').blur(function() {
    if ($(this).val().length == 0) {
      $(this).parent('.input-block').removeClass('focus');
      $(this).parent().find('label').animate({
        'top': '25px',
        'fontSize': '18px'
      }, 300);
    }
  })


  var $cell = $('.card');

  //open and close card when clicked on card
  $cell.find('.js-expander').click(function() {
  
    var $thisCell = $(this).closest('.card');
  
    if ($thisCell.hasClass('is-collapsed')) {
      $cell.not($thisCell).removeClass('is-expanded').addClass('is-collapsed').addClass('is-inactive');
      $thisCell.removeClass('is-collapsed').addClass('is-expanded');
      
      if ($cell.not($thisCell).hasClass('is-inactive')) {
        //do nothing
      } else {
        $cell.not($thisCell).addClass('is-inactive');
      }
  
    } else {
      $thisCell.removeClass('is-expanded').addClass('is-collapsed');
      $cell.not($thisCell).removeClass('is-inactive');
    }
  });
  
  //close card when click on cross
  $cell.find('.js-collapser').click(function() {
  
    var $thisCell = $(this).closest('.card');
  
    $thisCell.removeClass('is-expanded').addClass('is-collapsed');
    $cell.not($thisCell).removeClass('is-inactive');
  
  });