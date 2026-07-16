$(document).ready(function(){
    var popOverSettings = {
    placement: 'right',
    container: 'body',
    html: true,
    toggle:'popover',
    selector: '[rel="popover"]',
    content: function () {
        return $('#delete_confirmation_content').html();
    }
}
var popOverDeleteLink = $("#delete_confirmation_content").find('.delete-data-link');
var popOverDeleteUrl = $("#delete_confirmation_content").find('.delete-data-link').data('delete-path');

$('body').popover(popOverSettings);

//common for all places
    $.ajaxSetup({
       headers: {
         'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
       }
    });
});

var common = function(){
    return {
        init:function(){
            common.handleLevelSelection();
            common.handleSessionSelection();
        },

        handleLevelSelection:function() {
          $("#global_level").change(function(){
              var id = $(this).val();
              var action = $(this).data('url');
               $.ajax({
                      url: action,
                      method:'POST',
                      data: {id:id},
                      success: function(response){
                          showMessage("Please wait, Reloading...","warning");
                            setTimeout(function() {
                              location.reload();
                          }/*, 2000*/);
                      },
                      beforeSend: function(){
                          $("#spinner-div").show();
                      },
                });
          });
        },
        handleSessionSelection:function() {
          $("#session_master_id").change(function(){
              var id = $(this).val();
              var action = $(this).data('url');
               $.ajax({
                      url: action,
                      method:'POST',
                      data: {id:id},
                      success: function(response){
                          showMessage("Please wait, Reloading...","warning");
                            setTimeout(function() {
                              location.reload();
                          }/*, 2000*/);

                      },
                      beforeSend: function(){
                          $("#spinner-div").show();
                      },
                });
          });
        }
    }
}();
common.init();

function DeleteRecord()
{

}

function AjaxPost(sFormId,sUrl,sDivId,bLoader=true,bAsync=true,bLoaderHide = true)
{
    //sUrl = SITE_URL + sUrl;
    $.ajax({
        type: $(sFormId).attr('method'), // <-- get method of form
        url: sUrl, // <-- get action of form
        data: $(sFormId).serialize(), // <-- serialize all fields into a string that is ready to be posted to your PHP file
        /*contentType: false,
        processData: false,*/
        async:bAsync,
        beforeSend: function(){
            $(sDivId).html('');
            if(bLoader==true){
              $("#spinner-div").show();
            }
        },
        success: function(data){
            var input_type = $(sDivId).prop("type");
            if(input_type=="hidden"){
              $(sDivId).val(data);
            } 
            else if(data.download_url){
                window.location.href = data.download_url;  // Start the download
            }
            else {
              $(sDivId).html(data);
            }
        },
        error:function (xhr, ajaxOptions, thrownError) {
            //console.log(xhr);
            if(ajaxOptions == 'error'){
                if(xhr.responseJSON.errors)
                {
                  $.each(xhr.responseJSON.errors, function(key, value){
                    showMessage(value[0], 'error');
                  });
                }
                else
                {
                  showMessage(xhr.responseJSON.message, 'error');
                }

            } else if(ajaxOptions == 'timeout'){
                showMessage("Ajax timeout","error");
                showMessage("Please wait, Reloading...","warning");
                setTimeout(function() {
                    location.reload(true);
                }, 2000);
            }
            if(bLoader==true && bLoaderHide==true){
              $("#spinner-div").hide();
            }
        },

        complete:function(){
          if(bLoader==true && bLoaderHide==true){
            $("#spinner-div").hide();
          }
        }
    });
}

function AjaxPostReturn(sFormId,sUrl,bLoader=true,bAsync=true,bLoaderHide = true)
{
  var response = "";
    //sUrl = SITE_URL + sUrl;
    $.ajax({
        type: $(sFormId).attr('method'), // <-- get method of form
        url: sUrl, // <-- get action of form
        data: $(sFormId).serialize(), // <-- serialize all fields into a string that is ready to be posted to your PHP file
        /*contentType: false,
        processData: false,*/
        async:false,
        beforeSend: function(){
            if(bLoader==true){
              $("#spinner-div").show();
            }
        },
        success: function(data){
            response = data;
        },
        error:function (xhr, ajaxOptions, thrownError) {
            //console.log(xhr);
            if(ajaxOptions == 'error'){
                if(xhr.responseJSON.errors)
                {
                  $.each(xhr.responseJSON.errors, function(key, value){
                    showMessage(value[0], 'error');
                  });
                }
                else
                {
                  showMessage(xhr.responseJSON.message, 'error');
                }

            } else if(ajaxOptions == 'timeout'){
                showMessage("Ajax timeout","error");
                showMessage("Please wait, Reloading...","warning");
                setTimeout(function() {
                    location.reload(true);
                }, 2000);
            }
            if(bLoader==true && bLoaderHide==true){
              $("#spinner-div").hide();
            }
        },

        complete:function(){
          if(bLoader==true && bLoaderHide==true){
            $("#spinner-div").hide();
          }
        }
    });

    return response;
}

function AjaxPostDefault(sFormId,sUrl,bLoader=true,bAsync=true)
{
    //sUrl = SITE_URL + sUrl;
    var fStatus = false;
    $.ajax({
        type: $(sFormId).attr('method'), // <-- get method of form
        url: sUrl, // <-- get action of form
        data: $(sFormId).serialize(), // <-- serialize all fields into a string that is ready to be posted to your PHP file
        /*contentType: false,
        processData: false,*/
        async:bAsync,
        beforeSend: function(){
            if(bLoader==true){
              $("#spinner-div").show();
            }
        },
        success: function(data){
          if(data.status == 'success'){
            showMessage(data.message,data.status);
            fStatus = true;
          }
        },
        error:function (xhr, ajaxOptions, thrownError) {
            //console.log(xhr);
            if(ajaxOptions == 'error'){
                if(xhr.responseJSON.errors)
                {
                  $.each(xhr.responseJSON.errors, function(key, value){
                    showMessage(value[0], 'error');
                  });
                }
                else
                {
                  showMessage(xhr.responseJSON.message, 'error');
                }

            } else if(ajaxOptions == 'timeout'){
                showMessage("Ajax timeout","error");
                showMessage("Please wait, Reloading...","warning");
                setTimeout(function() {
                    location.reload(true);
                }, 2000);
            }
            if(bLoader==true){
              $("#spinner-div").hide();
            }
        },

        complete:function(){
          if(bLoader==true){
            $("#spinner-div").hide();
          }
        }
    });
    return fStatus;
}

function AjaxPostJson(JsonData,sUrl,bLoader=true)
{
alert(sUrl);
    //sUrl = SITE_URL + sUrl;
    var json = "";
    $.ajax({
        type: 'POST', // <-- get method of form
        url: sUrl,
        dataType: "json",
        async: false,
        data: JsonData, // <-- serialize all fields into a string that is ready to be posted to your PHP file
        beforeSend: function(){
          if(bLoader==true){
            $("#spinner-div").show();
          }
        },
        success: function(data){
            json = data;
        },
        error:function (response) {
            // console.log(response);
            // if(response.responseJSON != 'undefined'){
            //   if(response.responseJSON.errors != 'undefined'){
            //      $.each(response.responseJSON.errors, function (key, data) {
            //           showMessage(data[0],'error');
            //       });
            //   }
            // }
            if(bLoader==true){
              $("#spinner-div").hide();
            }

        },
        complete:function(){
          if(bLoader==true){
            $("#spinner-div").hide();
          }
        }
    });
    return json;
}

function allownMinMax(oSel_Obj,maximum=null,minimum=0)
{
  if(oSel_Obj!='undefined'){
    let str = oSel_Obj.value;
    if(oSel_Obj.value > maximum){
      oSel_Obj.value = ''; //str.substring(0, str.length - 1);
    }
    if(oSel_Obj.value < minimum){
      oSel_Obj.value = '';
    }
  }
  return true;
}
function allowOnlyNumeric(oSel_Obj,evnt, bNot_Allow_Dot_Flag, bCountDecimalPlaces=2,minimum,maximum)
  {
    // Ascii code for characters which are allowed.
    /*
    8   : Back Space
    9   : Tab.
    13  : Enter(Carriage Return).
    35  : End
    36  : Home
    37  : Left Arrow
    38  : Up Arrow
    38  : Right Arrow
    40  : Down Arrow
    45  : Dash
    46  : DOT (conditional)
    127 : DEL
    */
    var browserName=navigator.appName;
    var bDot_Exist=0;
    var val=oSel_Obj.value;
    var dotcnt;
    if(bNot_Allow_Dot_Flag==1)
    {
        dotcnt=1;
    }
    else
    {
      if(bCountDecimalPlaces==undefined)
        bCountDecimalPlaces=2;
      // Checking whether a dot (.) is present or not
      for(i=0; i<val.length; i++)
      {
        if(val.charCodeAt(i)==46)
        {
          bDot_Exist=1;
          break;
        }
      }
      if(bDot_Exist!=1)
        dotcnt=0;
      else
        dotcnt=1;
    }
    var whichCode = (evnt.which) ? evnt.which : evnt.keyCode;
    var charCode;
    //alert(whichCode);
    if(whichCode == 45){
      return false;
    }
    if(evnt.charCode == undefined)
      charCode  = -1
    else
      charCode = evnt.charCode;

    if(whichCode == 8 || whichCode == 9 || whichCode == 13 || whichCode == 127 || whichCode == 45 || (whichCode == 35 && charCode == 0) || (whichCode == 36 && charCode == 0) || (whichCode == 37 && charCode == 0) || (whichCode == 38 && charCode == 0) || (whichCode == 39 && charCode == 0) || (whichCode == 40 && charCode == 0) || (whichCode == 46 && charCode == 0))
    {
      if(minimum != undefined && parseFloat(val) < minimum)
        return false;

      if(maximum != undefined && parseFloat(val) > maximum)
        return false;
     return true;
    }

    // removing second instance of dot (.) here since we have one dot already.
    if(dotcnt==1 && (whichCode==46))  // DOT
    {
      return false;
    }

    if(bNot_Allow_Dot_Flag!=1)
    {
      if(parseInt(bDot_Exist))
      {
        var splitDecimal=(val).split(".");
        if(splitDecimal[1].length >= bCountDecimalPlaces)
        {
          return false;
        }
      }
    }
    if((whichCode < 48 || whichCode > 57) && whichCode != 46 && whichCode != 13)
    {
      return false;
    }
    else if(whichCode==46)
    {
      dotcnt=1;
    }
    else
    {
      if(minimum != undefined && String.fromCharCode(whichCode) < minimum)
        return false;

      if(maximum != undefined && String.fromCharCode(whichCode) > maximum)
        return false;
    }
  }

  function inheritAll(objParent,clsChildren)
  {
    var objChileren = document.getElementsByClassName(clsChildren);

    if(objChileren.length != "undefined"){
        for(var i=0; i<objChileren.length; i++) {
            if(!objChileren[i].readOnly){
                objChileren[i].value = objParent.value;
            }
        }
    }

    objChileren.value = objParent.value;

    // console.log(objChileren);
    return;
  }

  function allowOnlyAlphabets(evnt){
    var inputValue = evnt.charCode;
    // if (!(inputValue >= 6/*A*/ && inputValue <=90/*Z*/) && !(inputValue >=97/*a*/ && inputValue <= 122/*z*/) && (inputValue != 44/*comma*/ && inputValue != 13/*enter key*/) && inputValue > 31 && (inputValue < 48 || inputValue > 57)) { //allowOnlyNumericAndAlpha
    if (!(inputValue >= 65/*A*/ && inputValue <=90/*Z*/) && !(inputValue >=97/*a*/ && inputValue <= 122/*z*/)) {
        return false;
    }
  }

  function showReport(form_name)
  {
    window.open('',form_name,'location=no,menubar=no,titlebar=no,scrollbars=yes,menubar=no,height=1000,width=1200,resizable=yes,toolbar=no,status=no');

    document.forms[form_name].target = form_name;
    document.forms[form_name].submit();
  }
