function menuList(){
  $.ajax({
    url : '../js/menu.json',
    type : 'GET',
    dataType : 'json',
    success : function(data) {
      // 파일명 확인
      var menuItem = ""; // 메뉴 서브 html
      var url = $(location).attr('href'); // 현재페이지 경로
      var loc = url.split("/"); // 경로 문자열 분할
      var name = loc[loc.length-1].split("/")[0]; // 파일명
      // json 키값 구분
      // var keyVal;
      // if (name.indexOf("0002") !== -1) {
      //   keyVal = 'chartjs';
      // } else if(name.indexOf("0003") !== -1){
      //   keyVal = 'apexchart';
      // } else if (name.indexOf("0004") !== -1){
      //   keyVal = 'd3chart';
      // } else if (name.indexOf("0005") !== -1){
      //   keyVal = 'otherchart';
      // } else if (name.indexOf("0006") !== -1){
      //   keyVal = 'cssani';
      // } else if (name.indexOf("0007") !== -1){
      //   keyVal = 'jsani';
      // }

      var keyVal = Object.keys(data);
      for (var i = 0; i < keyVal.length; i++) {
        if (name.indexOf("000" + (i+2)) !== -1) {
          // 실행
          $.each(data, function(key, value){
            if (key == keyVal[i]) {
              var chartItem = $(this);
              for (var j = 0; j < chartItem.length; j++) {
                var link = chartItem[j];
                menuItem += '<li>';
                if (name == link.href) {
                  menuItem += '<a href="'+ link.href +'" class="active">'+ link.menuName +'</a>';
                } else {
                  menuItem += '<a href="'+ link.href +'">'+ link.menuName +'</a>';
                }
                menuItem += '</li>';
              }
            }
          });
        }
      }
      $('#pMenu').append(menuItem);
    }
  });
}

$(function(){
  if ($('.p_menu').length > 0) {
    menuList();
  }
  $('#floatMenu').click(function(){
    $(this).parent('.sub_menu').toggleClass('on');
  });
  $('.typeing-re').click(function(){
    $('.typeing').removeClass('on');
    $('.typeing').width();
    $('.typeing').addClass('on');
  });
  //menu slide(left open)
  $('.open_menu').click(function () {
      $('.cont_area').toggleClass('side-close');
      $('.menu').toggleClass('side-close');
      $('*').removeClass('open')
      $('.documents').removeAttr("style").attr("style","display:none");
  });
  // menu
  $('.menu li.active').addClass('open').children('ul').show();
  $('.menu li.has-sub>a').on('click', function () {
      $('*').removeClass('side-close')
      $(this).removeAttr('href');
      var element = $(this).parent('li');
      if (element.hasClass('open')) {
          element.removeClass('open');
          element.find('li').removeClass('open');
          element.find('ul').slideUp(200);
      } else {
          element.addClass('open');
          element.children('ul').slideDown(200);
          element.siblings('li').children('ul').slideUp(200);
          element.siblings('li').removeClass('open');
          element.siblings('li').find('li').removeClass('open');
          element.siblings('li').find('ul').slideUp(200);
          $('.menu ul ul li').children('a').removeClass('active');
      }
  });
  $('.menu li.nope-sub').on('click', function(){
    $(this).addClass('open').siblings('li').removeClass('open');
    $('.menu ul ul li').children('a').removeClass('active');
    $('.menu ul').find('ul').slideUp(200);
  })
  //2depth menu choice
  $('.menu ul ul li').click(function() {
      $(this).children('a').addClass('active');
      $(this).siblings().children('a').removeClass('active');
  });

  // custom checkbox label change
  $(".chk_custom label").children('input').click(function(){
    $(this).parent('label').toggleClass("checked")
  });

  //treeview
  $('li:not(:has(ul))').css({ cursor: 'default', 'list-style-image':'none'});

  $('.tree_img .tree_in:has(ul)')
      .css({cursor: 'pointer', 'list-style-image':'url(../img/icon/plus_02.png)'})
      .children().hide();
  $('.tree_img .tree_in:has(ul)').click(function(event){
      if(this == event.target){
          if ($(this).children().is(':hidden')) {
              $(this).css('list-style-image', 'url(../img/icon/minus_02.png)').children().slideDown();
          }
          else {
              $(this).css('list-style-image', 'url(../img/icon/plus_02.png)').children().slideUp();
          }
      }
      return false;
  });

  $('.tree_basic .tree_in:has(ul)')
      .css({cursor: 'pointer', 'list-style-image':'url(../img/icon/plus.png)'})
      .children().hide();
  $('.tree_basic .tree_in:has(ul)').click(function(event){
      if(this == event.target){
          if ($(this).children().is(':hidden')) {
              $(this).css('list-style-image', 'url(../img/icon/minus.png)').children().slideDown();
          }
          else {
              $(this).css('list-style-image', 'url(../img/icon/plus.png)').children().slideUp();
          }
      }
      return false;
  });

  // $('.ani_menu a').click(function(){
  //   $(this).parent('li').addClass('on');
  //   $(this).parent('li').siblings('li').removeClass('on');
  // });

//비밀번호 안정성 체크
function validatePassword (pw) {
  var o = {
  length: [8, 16],
  lower: 1,
  upper: 1,
  alpha: 1, /* lower + upper */
  numeric: 1,
  special: 1,
  badWords: [],
  badSequenceLength: 7,
  noQwertySequences: true,
  spaceChk: true,
  noSequential: false };

  // space bar check
  if (o.spaceChk && /\s/g.test(pw)) {
    $('.err_txt').show().text("비밀번호에 공백문자가 있습니다.");
  }
  //password 길이 체크
  if (pw.length < o.length[0] || pw.length > o.length[1]) {
    $('.err_txt').show().text("비밀번호는 " + o.length[0] + "자 이상 " + o.length[1] + "자 이내로 입력하셔야 합니다.");
  }

  // bad sequence check
  if (o.badSequenceLength && pw.length >= o.length[0]) {
    var lower = "abcdefghijklmnopqrstuvwxyz",
        upper = lower.toUpperCase(),
        numbers = "0123456789",
        qwerty = "qwertyuiopasdfghjklzxcvbnm",
        start = o.badSequenceLength - 1, seq = "_" + pw.slice(0, start);

    for (i = start; i < pw.length; i++) {
      seq = seq.slice(1) + pw.charAt(i);

      if ( lower.indexOf(seq) > -1 || upper.indexOf(seq) > -1 || numbers.indexOf(seq) > -1 || (o.noQwertySequences && qwerty.indexOf(seq) > -1) ) {
        $('.err_txt').show().text("예측할 수 있는 연속된 문자가 있습니다.");
      }
    }
  }
  //password 정규식 체크
  var re = { lower: /[a-z]/g, upper: /[A-Z]/g, alpha: /[A-Z]/gi, numeric: /[0-9]/g, special: /[\W_]/g }, i;
  var lower = (pw.match(re['lower']) || []).length > 0 ? 1 : 0;
  var upper = (pw.match(re['upper']) || []).length > 0 ? 1 : 0;
  var numeric = (pw.match(re['numeric']) || []).length > 0 ? 1 : 0;
  var special = (pw.match(re['special']) || []).length > 0 ? 1 : 0;

  //숫자로만 이루어지면 낮음
  if((pw.match(re['numeric']) || []).length == pw.length ) {
    $('.err_txt').show().text("영문 대소문자, 숫자 및 특수문자 사용");
  } else if(lower + upper + numeric + special <= 2){
    //숫자, 알파벳(대문자, 소문자), 특수문자 2가지 조합
    $('.chk_dotbox .chk_dot:first-child').css('background-color','#e81b1b');
    $('.chk_dotbox .chk_dot').not(':first-child').css('background-color','#ddd');
    $('.chk_txt').show().text('비밀번호 강도 : 낮음');
  } else if(lower + upper + numeric + special <= 3) {
    //숫자, 알파벳(대문자, 소문자), 특수문자 3가지 조합
    $('.chk_dotbox .chk_dot').not(':last-child').css('background-color','#ffba2e');
    $('.chk_dotbox .chk_dot:last-child').css('background-color','#ddd');
    $('.chk_txt').show().text('비밀번호 강도 : 적정');
  } else {
    //숫자, 알파벳(대문자, 소문자), 특수문자 4가지 조합
    $('.chk_dotbox .chk_dot').css('background-color','#14d003');
    $('.chk_txt').show().text('비밀번호 강도 : 높음');
    $('.err_txt').text('');
    if (/\s/g.test(pw)) {
      $('.chk_txt').hide();
      $('.chk_dotbox .chk_dot').css('background-color','#e81b1b');
      $('.err_txt').text('비밀번호에 공백문자가 있습니다.');
    }
  }
  // enforce the no sequential, identical characters rule
  if (o.noSequential && /([\S\s])\1/.test(pw)) return "no sequential";

  // enforce word ban (case insensitive)
  for (i = 0; i < o.badWords.length; i++) {
    if (pw.toLowerCase().indexOf(o.badWords[i].toLowerCase()) > -1) return "bad word";
  }
}
// 비밀번호 강도 체크
$('#newPwd').on("change", function() {
  var value = $(this).val();
  validatePassword(value);
  if (value == '') {
    $('.err_txt').text('');
    $('.chk_dot').css('background-color','#ddd');
    $('.chk_txt').hide();
  }
});

  // date picker / MOCKUP 편의상 통합코드
if ($('[data-ax5picker]').length > 0) {
  var picker = new ax5.ui.picker();
}
$('[data-ax5picker]').each(function(){
  picker.bind({
      target: $(this),
      direction: "top",
      content: {
          width: 270,
          margin: 10,
          type: 'date',
          config: {
              control: {
                  left: '<i class="fa fa-chevron-left"></i>',
                  yearTmpl: '%s',
                  monthTmpl: '%s',
                  right: '<i class="fa fa-chevron-right"></i>'
              },
              lang: {
                  yearTmpl: "%s년",
                  months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                  dayTmpl: "%s"
              },
              marker: (function () {
                  var marker = {};
                  marker[ax5.util.date(new Date(), {'return': 'yyyy-MM-dd', 'add': {d: 0}})] = true;

                  return marker;
              })()
          },
          formatter: {
              pattern: 'date'
          }
      },
      onStateChanged: function () {
          if (this.state == "open") {
              //console.log(this.item);
              var selectedValue = this.self.getContentValue(this.item["$target"]);
              if (!selectedValue) {
                  this.item.pickerCalendar[0].ax5uiInstance.setSelection([ax5.util.date(new Date(), {'add': {d: 1}})]);
              }
          }
      }
  });
});

  /* time picker (toast) / MOCKUP 편의상 통합코드 */
  $('[data-toastTime]').each(function(){
    var tpSelectbox = new tui.TimePicker(this, {
        initialHour: 3,
        initialMinute: 3,
        disabledHours: [1, 2, 14],
        inputType: 'selectbox'
    });

    var timePickerClass = tpSelectbox._$container;
    if (timePickerClass.hasClass('disabled')) {
      timePickerClass.find('select').attr('disabled',true);
    }
  });
});
