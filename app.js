
/**
 * First we will load all of this project's JavaScript dependencies which
 * include Vue and Vue Resource. This gives a great starting point for
 * building robust, powerful web applications using Vue and Laravel.
 */

//require('./bootstrap');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the body of the page. From here, you may begin adding components to
 * the application, or feel free to tweak this setup for your needs.
 */

//Vue.component('example', require('./components/Example.vue'));

// const app = new Vue({
//     el: '#app'
// });


expReqFlag = "0";
expReqType = "0";

$(function() {
    $.ajaxSetup ({
        cache: false
    });

    
	console.log("loaded...");

	// CONTACT FORM
	$( "#btn_contact" ).click(function() {
		validateContactForm();
	});


});

function validateContactForm() {
	var cf_firstname = $("#cf_firstname").val();
	var cf_lastname = $("#cf_lastname").val();
	var cf_email = $("#cf_email").val();
	var cf_phone = $("#cf_phone").val();
	var cf_message = $("#cf_message").val();

	// CHECK IF ALL FIELDS ARE THERE
	if ( (cf_firstname === "") || (cf_lastname === "") || (cf_email === "") || (cf_phone === "") || (cf_message === "") ) {
		modalAlert("Contact Form", "Please complete all the required fields");
	} else {
		if (!validateEmail(cf_email)) {
			modalAlert("Contact Form", "Please enter a valid Email");
		} else {
			$("#contactForm").submit();
			//console.log("submit");
		}
	}
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function modalAlert(title, text) {
	$("#modalTitle").html(title);
	$("#modalText").html(text);
	$('#myModal').modal('show');
}


function renderJob(results, mode) {

    $(".inp_coverLetter").show();
    $(".uploadCV").show();    
    $(".btn-apply").removeClass("pull-right");

    if ( (results[0].jp_ats != "") && (results[0].jp_ats != null) ){
        $(".inp_coverLetter").hide();
        $(".uploadCV").hide();
        $(".btn-apply").addClass("pull-right");
    }

    if ( (results[0].jp_crewType_id == "1") || (results[0].jp_crewType_id == "2") ) { 
        if ( results[0].jp_crewType_id == "1" ) {
            $("#mdl_title").html('<strong>Captain - ' + results[0].am_title + ' ' + results[0].at_title + '</strong>');
            $("#mdl_jobtype").html('Captain');  
        } else {
            $("#mdl_title").html('<strong>First Officer - ' + results[0].am_title + ' ' + results[0].at_title + '</strong>');
            $("#mdl_jobtype").html('First Officer');  
        }
       
        requirementsArea = "";
        requirementsArea += "<div class=\"requirements-left\">";
        requirementsArea += "<strong>Min Hours On Type:</strong> " + results[0].jp_hoursOnType + "<br />";
        requirementsArea += "<strong>Min PIC On Type:</strong> " + results[0].jp_hoursOnTypePic + "<br />";
        requirementsArea += "<strong>Min PIC Hours TT:</strong> " + results[0].jp_hoursPic + "<br /><br />";
        requirementsArea += "<strong>Visa's Required:</strong> " + results[0].jp_visa + "<br />";

        requirementsArea += "<strong>Languages Required:</strong><br />";
        jplangs = results["langs"]; langsStr = "";
        for (var i = 0; i < jplangs.length; i++) { 
            langsStr += jplangs[i].l_title + " - " + jplangs[i].jpl_level + "<br />";
        }
        
        requirementsArea += langsStr;
        requirementsArea += "</div>";
        
        $("#mdl_jobRequirements").html(requirementsArea); 

        // MODAL INFO AREA
        modalInfoText = "";

        if (results[0].jp_jobType == "1") {
            if (results[0].jp_stealth == "1") {
                modalInfoText += "<strong>Full Time</strong><br /><br />";
            } else {
                modalInfoText += "<strong>" + results[0].e_companyName + " - Full Time</strong><br /><br />";
            }
        } else {
            if (results[0].jp_stealth == "1") {
                modalInfoText += "<strong>Freelance</strong><br /><br />";
            } else {
                modalInfoText += "<strong>" + results[0].e_companyName + " - Freelance</strong><br /><br />";
            }
        }

        modalInfoText += "<strong>Location:</strong> " + results[0].jp_departureCity + ", " + results[0].country_name + "<br />";

        if (results[0].jp_expRequired == "1") {
            modalInfoText += "<strong>Type Rating:</strong> Required<br />";
        } else {
            modalInfoText += "<strong>Type Rating:</strong> Not Required<br />";
        }

        modalInfoText += "<strong>Minimum Hours TT:</strong> " + results[0].jp_hours + "<br />";

        licstr = "";
        if ( getLicense( results[0].jp_license1 ) != "") { licstr += getLicense( results[0].jp_license1 ) + ", "; }
        if ( getLicense( results[0].jp_license2 ) != "") { licstr += getLicense( results[0].jp_license2 ) + ", " ; }
        if ( getLicense( results[0].jp_license3 ) != "") { licstr += getLicense( results[0].jp_license3 ) ; }
        licstr = licstr.replace(/,\s*$/, "");
        modalInfoText += "<strong>Licences Accepted:</strong> " + licstr + "<br />";

        if (results[0].jp_jobType == "1") {
            if (results[0].jp_expSalary != "") {
                modalInfoText += "<strong>Annual Salary:</strong> " + getCurrencySign(results[0].jp_currency) + " " + results[0].jp_expSalary + "<br /><br />";
            }
        } else {
            if (results[0].jp_expRate != "") {
                modalInfoText += "<strong>Daily Rate:</strong> " + getCurrencySign(results[0].jp_currency) + " " + results[0].jp_expRate + "<br /><br />";
            }
        }

        if (results[0].jp_reqFrom != null) {
            var d = new Date(results[0].jp_reqFrom);
            modalInfoText += "<strong>Job Starts:</strong> " + formatDate(d) + "<br />";
        }   

        if (results[0].jp_reqTo != null) {
            var d = new Date(results[0].jp_reqTo);
            modalInfoText += "<strong>Job Ends:</strong> " + formatDate(d) + "<br />";
        }    

        $(".modal-infoarea").html(modalInfoText);

    } else {
        $("#mdl_title").html('<strong>Flight Attendant - ' + results[0].am_title + ' ' + results[0].at_title + '</strong>');
        $("#mdl_jobtype").html('Flight Attendant');

        requirementsArea = "";
        requirementsArea += "<div class=\"requirements-left\">";
        requirementsArea += "<strong>Visa's Required:</strong> " + results[0].jp_visa + "<br /><br />";

        requirementsArea += "<strong>Languages Required:</strong><br />";
        jplangs = results["langs"]; langsStr = "";
        for (var i = 0; i < jplangs.length; i++) { 
            langsStr += jplangs[i].l_title + " - " + jplangs[i].jpl_level + "<br />";
        }
        
        requirementsArea += langsStr;
        
        requirementsArea += "</div>";
        
        $("#mdl_jobRequirements").html(requirementsArea);  

        // MODAL INFO AREA
        modalInfoText = "";

        if (results[0].jp_jobType == "1") {
            if (results[0].jp_stealth == "1") {
                modalInfoText += "<strong>Full Time</strong><br /><br />";
            } else {
                modalInfoText += "<strong>" + results[0].e_companyName + " - Full Time</strong><br /><br />";
            }
        } else {
            if (results[0].jp_stealth == "1") {
                modalInfoText += "<strong>Freelance</strong><br /><br />";
            } else {
                modalInfoText += "<strong>" + results[0].e_companyName + " - Freelance</strong><br /><br />";
            }
        }

        modalInfoText += "<strong>Location:</strong> " + results[0].jp_departureCity + ", " + results[0].country_name + "<br />";

        if (results[0].jp_expRequired == "1") {
            modalInfoText += "<strong>Type Experience:</strong> Required<br />";
        } else {
            modalInfoText += "<strong>Type Experience:</strong> Not Required<br />";
        }

        modalInfoText += "<strong>Years Experience:</strong> " + results[0].jp_expYears + "<br />";
        modalInfoText += "<strong>Corporate Years Experience:</strong> " + results[0].jp_expCorporate + "<br />";

        if (results[0].jp_jobType == "1") {
            if (results[0].jp_expSalary != "") {
                modalInfoText += "<strong>Annual Salary:</strong> " + getCurrencySign(results[0].jp_currency) + " " + results[0].jp_expSalary + "<br /><br />";
            }
        } else {
            if (results[0].jp_expRate != "") {
                modalInfoText += "<strong>Daily Rate:</strong> " + getCurrencySign(results[0].jp_currency) + " " + results[0].jp_expRate + "<br /><br />";
            }
        }

        if (results[0].jp_reqFrom != null) {
            //var d = new Date(results[0].jp_reqFrom);
            var d = moment(results[0].jp_reqFrom).format('Do MMMM YYYY');
            modalInfoText += "<strong>Job Starts:</strong> " + d + "<br />";
        }   

        if (results[0].jp_reqTo != null) {
            // 
            //var d = new Date(results[0].jp_reqTo);
            var d = moment(results[0].jp_reqTo).format('Do MMMM YYYY');
            modalInfoText += "<strong>Job Ends:</strong> " + d + "<br />";
        }    


        $(".modal-infoarea").html(modalInfoText);


    }
    
    if (results[0].jp_description != null) { $("#mdl_additionalreqs").html(results[0].jp_description ); }
    
    //var d = new Date(results[0].jp_dateAdded);
    var d = moment(results[0].jp_dateAdded).format('Do MMMM YYYY');

    if (results[0].e_profilePicture != null) {
        if (results[0].jp_stealth == "1") {
            if (mode != "crew") {
                $("#mdl_logo").html('<img src="/img/joblistings-plane.png" alt=""><br />Posted: ' + d + '<br /><p><a href="/employer/joblistings/edit/' + results[0].jobPost_id + '" class="edit-button">EDIT</a><span class="remove-button"> | <a class="delete-button" onclick="removeJob(' + results[0].jobPost_id + ');">REMOVE POSTING</a></span></p>');        
            } else {
                $("#mdl_logo").html('<img src="/img/joblistings-plane.png" alt=""><br />Posted: ' + d );        
            }
        } else {
            if (mode != "crew") {
                $("#mdl_logo").html('<img src="/uploads/' + results[0].e_profilePicture + '" alt=""><br />Posted: ' + d + '<br /><p><a href="/employer/joblistings/edit/' + results[0].jobPost_id + '" class="edit-button">EDIT</a><span class="remove-button">  | <a class="delete-button" onclick="removeJob(' + results[0].jobPost_id + ');">REMOVE POSTING</a></span></p>');                
            } else {
                $("#mdl_logo").html('<img src="/uploads/' + results[0].e_profilePicture + '" alt="">');                
            }
        }
    } else {
        if (mode != "crew") {
            $("#mdl_logo").html('<img src="/img/joblistings-plane.png" alt=""><br />Posted: ' + d + '<br /><p><a href="/employer/joblistings/edit/' + results[0].jobPost_id + '" class="edit-button">EDIT</a><span class="remove-button">  | <a class="delete-button" onclick="removeJob(' + results[0].jobPost_id + ');">REMOVE POSTING</a></span></p>');    
        } else {
            $("#mdl_logo").html('<img src="/img/joblistings-plane.png" alt=""><br />Posted: ' + d );    
        }
    }

    $("#lnk_apply").attr("rel", results[0].jobPost_id );
    $("#lnk_applyATS").attr("rel", results[0].jobPost_id );

    // SOCIAL LINKS

        postUrl = "https://www.privatejetcrew.com/jobpost/" + results[0].jobPost_id;
        $("#lnk_shareFB").attr("href","https://www.facebook.com/sharer/sharer.php?u=" + postUrl);
        $("#lnk_shareTwitter").attr("href","https://twitter.com/home?status=" + postUrl );
        $("#lnk_shareLinkedin").attr("href","https://www.linkedin.com/shareArticle?mini=true&url=" + postUrl + "&title=&summary=&source=");
        $("#lnk_shareEmail").attr("href","mailto:?&subject=Private Jetcrew - New Job Post&body=" + postUrl);

    if (mode == "crew") {
    


        if (hasApplied( results[0].jobPost_id )) {
            $("#btn_cantapply").show();
            $("#btn_apply").hide();
        } else {
            //console.log("MATCH: " + results[0].match);
            // $("#btn_cantapply").hide();
            // $("#btn_apply").show();
            if (results[0].match == "1") {
                $("#btn_cantapply").hide();
                $("#btn_apply").show();
                if ( (results[0].jp_ats != "") && (results[0].jp_ats != null)  ){
                    //$(".pnl_applyCover").show();
                    $("#lnk_applyExpand").hide();
                    $(".btn-applyATS").show();
                    // $(".inp_coverLetter").hide();
                    // $(".uploadCV").hide();
                } else {
                    $("#lnk_applyExpand").show();
                    $(".btn-applyATS").hide();
                }
            } else {
                $("#btn_cantapply").show();
                $("#txt_cantapply").html("You do not meet the minimum requirements to apply to this job");
                $("#btn_apply").hide();
            }
        }
    }

}

function buildElem(results, id, mode) {

    expReqFlag = results[id].jp_expRequired;
    expReqType = results[id].aircraftType_id;

    var elem = '';
    if (mode == "crew") {
        elem = '<div class="job-item">';
    } else {
        elem = '<div class="job-item-employer">';
    }
    elem += '<div class="job-tag">';
    
    if ( results[id].jp_crewType_id == "1" ) {
        //if (results[id].at_sTitle != null) {
            //elem = elem + '<p>Captain - ' + results[id].am_title + ' ' + results[id].at_sTitle + '</p>';        
        //} else {
            elem = elem + '<p>Captain - ' + results[id].am_title + ' ' + results[id].at_title + '</p>';        
        //}
    }
    if ( results[id].jp_crewType_id == "2" ) {
        //if (results[id].at_sTitle != null) {
            //elem = elem + '<p>First Officer - ' + results[id].am_title + ' ' + results[id].at_sTitle + '</p>';        
        //} else {
            elem = elem + '<p>First Officer - ' + results[id].am_title + ' ' + results[id].at_title + '</p>';        
        //}
    }
    if ( results[id].jp_crewType_id == "3" ) {
        //if (results[id].at_sTitle != null) {
            //elem = elem + '<p>Flight Attendant - ' + results[id].am_title + ' ' + results[id].at_sTitle + '</p>';
        //} else {
            elem = elem + '<p>Flight Attendant - ' + results[id].am_title + ' ' + results[id].at_title + '</p>';        
        //}
    }
    elem = elem + '</div>';
    elem = elem + '<div class="joblistings-companylogoarea">';

    //var d = new Date(results[0].jp_dateAdded);

    var d = moment(results[0].jp_dateAdded).format('Do MMMM YYYY');
    //if (d == "Invalid date") { }

    if (results[id].e_profilePicture != null) {
        if (results[id].jp_stealth == "1") {
            elem = elem + '<img src="/img/joblistings-plane.png" alt=""><br /><span>Posted: ' + d + '</span>';        
        } else {
            elem = elem + '<img src="/uploads/' + results[id].e_profilePicture + '" alt=""><br /><span>Posted: ' + d + '</span>';    
        }
    } else {
        elem = elem + '<img src="/img/joblistings-plane.png" alt=""><br /><span>Posted: ' + d+ '</span>';    

    }
    if (mode == "employer") {
        elem = elem + '<p><a href="/employer/joblistings/edit/' + results[id].jobPost_id + '" class="edit-button">EDIT</a> <span style="color: black;">|</span> <a class="delete-button" onclick="removeJob(' + results[id].jobPost_id + ');">REMOVE POSTING</a></p>';
    }   

    if (mode == "employerExpired") {
        if ( results[id].e_noOfJobPosts > 0 ) {
            elem = elem + '<p class="remove-app"><a class="renew-job" onclick="renewJob(' + results[id].jobPost_id + ')">renew the job</a></p>';
        } else {
            elem = elem + '<p><a href="/employer/account/packages" class="edit-button">BUY CREDIT TO RENEW</a></p>';
        }
    }
    elem = elem + '</div>';
    elem = elem + '<div class="joblistings-infoarea">';

    console.log( "STEALTH: " + results[id].jp_stealth );
    if (results[id].jp_jobType == "1") {
        if (results[id].jp_stealth == "1") {
            elem += "<span class='jobPostTitle'><strong>Full Time</strong></span><br /><br />";
        } else {
            elem += "<span class='jobPostTitle'><strong>" + results[id].e_companyName + " - Full Time</strong></span><br /><br />";
        }
    } else {
        if (results[id].jp_stealth == "1") {
            elem += "<span class='jobPostTitle'><strong>Freelance</strong></span><br /><br />";
        } else {
            elem += "<span class='jobPostTitle'><strong>" + results[id].e_companyName + " - Freelance</strong></span><br /><br />";
        }
    }

    if (results[id].jp_crewType_id == 3) {
        elem += "<strong>Location:</strong> " + results[id].jp_departureCity + ", " + results[id].country_name + "<br />";

        if (results[id].jp_expRequired == "1") {
            elem += "<strong>Type Experience:</strong> Required<br />";
        } else {
            elem += "<strong>Type Experience:</strong> Not Required<br />";
        }

        elem += "<strong>Years Experience:</strong> " + results[id].jp_expYears + "<br />";        
        
        if ( results[id].jp_languages != null) {
            elem = elem + '<p>' + results[id].jp_languages + '</p>';
        }

        elem += "<strong>Languages Required:</strong> ";
        jplangs = results[id].langs; langsStr = "";
        for (var i = 0; i < jplangs.length; i++) { 
            //console.log(jplangs[i].l_title);
            langsStr += jplangs[i].l_title + "/";
        }

        langsStr = langsStr.slice(0, -1);

        elem += langsStr + "<br /><br />";

        //if (results[0].jp_reqFrom != null) {
            //var d = new Date(results[id].jp_reqFrom);
            var d = moment(results[id].jp_reqFrom).format('Do MMMM YYYY');
            if (d != "Invalid date") {
                elem += "<strong>Job Starts:</strong> " + d;
            }
        //}   
        
    } else {
        elem += "<strong>Location:</strong> " + results[id].jp_departureCity + ", " + results[id].country_name + "<br />";

        if (results[id].jp_expRequired == "1") {
            elem += "<strong>Type Rating:</strong> Required<br />";
        } else {
            elem += "<strong>Type Rating:</strong> Not Required<br />";
        }

        elem += "<strong>Minimum Hours TT:</strong> " + results[id].jp_hours + "<br />";

        licstr = "";
        if ( getLicense( results[id].jp_license1 ) != "") { licstr += getLicense( results[id].jp_license1 ) + "/"; }
        if ( getLicense( results[id].jp_license2 ) != "") { licstr += getLicense( results[id].jp_license2 ) + "/" ; }
        if ( getLicense( results[id].jp_license3 ) != "") { licstr += getLicense( results[id].jp_license3 ) ; }
        licstr = licstr.slice(0, -1);
        elem += "<strong>Licences Accepted:</strong> " + licstr + "<br /><br />";
        
        //if (results[0].jp_reqFrom != null) {
            //var d = new Date(results[id].jp_reqFrom);
            var d = moment(results[id].jp_reqFrom).format('Do MMMM YYYY');
            if (d != "Invalid date") {
                elem += "<strong>Job Starts:</strong> " + d;
            }
        //}   
        
    }
    elem = elem + '</div>';
    elem = elem + '<img class="img extend-icon" id="extendicon" onclick="openModal(' + results[id].jobPost_id + ')" rel="' + results[id].jobPost_id + '" src="/img/extend-icon.png" alt="">';
    elem = elem + '</div>';

    return elem;

}


function formatDate(date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  //date = parseDate(date, 'yyyy-mm-dd');

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  var dayPostfix = "th";
  if (day == "1") { dayPostfix = "st"; }
  if (day == "2") { dayPostfix = "nd"; }
  if (day == "3") { dayPostfix = "nd"; }

  return day + dayPostfix + ' ' + monthNames[monthIndex] + ' ' + year;

  //return  date.getUTCFullYear() +"/"+ (date.getUTCMonth()+1) +"/"+ date.getUTCDate();

}


function getCurrencySign(currency) {
    if (currency == "EUR") { return "EUR &euro;"; }
    if (currency == "GBP") { return "GBP £"; }
    if (currency == "USD") { return "USD $"; }
    if (currency == "HKD") { return "HKD $"; }
    if (currency == "AED") { return "AED &#1583;.&#1573;"; }
    if (currency == "CHF") { return "CHF"; }
    if (currency == "AUD") { return "AUD &#36;"; }
    if (currency == "JPY") { return "JPY &yen;"; }
    if (currency == "CNY") { return "CNY &yen;"; }
}

//function buildElemCandidate(results, favourites, id, expReq = '0', expType = '0') {
    function buildElemCandidate(results, favourites, id, expReq, expType) {

    console.log(results);

    var elem = '<div class="crew-item">';
    elem = elem + '<div class="job-tag">';
    elem = elem + "<p>" + results[id].c_firstname + ' ' + results[id].c_lastname + " - " + results[id].age + "</p>";
    elem = elem + '</div>';
    elem = elem + '<div class="joblistings-companylogoarea">';
    if (results[id].c_profilePicture != null) {
        // if (results[id].jp_stealth == "1") {
        //     elem = elem + '<img src="/img/joblistings-plane.png" alt="">';                
        // } else {
            elem = elem + '<img src="/uploads/' + results[id].c_profilePicture + '" alt="">';    
        //}
    } else {
        elem = elem + '<img src="/img/joblistings-person.png" alt="">';    
    }
    elem = elem + '</div>';
    elem = elem + '<div class="joblistings-infoarea">';

    if ( (results[id].c_crewType_id == "1") || (results[id].c_crewType_id == "2") ){
        
        jprats = results[id].ratings; ratsStr = "";

        if (jprats[0] != null) {
            if (expReq == "0") {
                if (jprats[0].cr_crewType_id == "1") {                
                    ratsStr += "Captain " + jprats[0].am_title + " " + jprats[0].at_title;                
                } else {                
                    ratsStr += "First Officer " + jprats[0].am_title + " " + jprats[0].at_title;                
                }
            } else {
                for (var i = 0; i < jprats.length; i++) { 
                    if ( jprats[i].aircraftType_id == expReqType ) {
                        if (jprats[i].cr_crewType_id == "1") {                
                            ratsStr += "Captain " + jprats[i].am_title + " " + jprats[i].at_title;                
                        } else {                
                            ratsStr += "First Officer " + jprats[i].am_title + " " + jprats[i].at_title;                
                        } 
                    }                    
                }
            }
        }

        elem = elem + '<strong>' + ratsStr + '</strong><br /><br />';
        elem = elem + '<strong>Total Hours:</strong> ' + results[id].c_flyingHours;
        elem = elem + '<br /><strong>Total Hours PIC:</strong> ' + results[id].c_flyingHoursPic;
        
        jplics = results[id].licences; licsStr = "";
        for (var i = 0; i < jplics.length; i++) { 
            licsStr += jplics[i].l_title + "/";
        }
        licsStr = licsStr.slice(0, -1);
        elem = elem + '<br /><strong>Licences:</strong> ' + licsStr;


        elem = elem + '<br /><br /><strong>Location:</strong> ' + results[id].c_city + ', ' + results[id].country_name;        
        elem = elem + '<br /><strong>Phone:</strong> ' + results[id].c_phone;
        elem = elem + '<br /><strong>Email:</strong> ' + results[id].c_email;        
        //elem = elem + '</p>';    
    } else {
        //elem = elem + '<p>' + results[id].c_firstname + ' ' + results[id].c_lastname;
        elem = elem + '<strong>Flight Attendant</strong><br /><br />';
        elem = elem + '<strong>Corporate Experience:</strong> ' + results[id].c_expCorporate + ' years';
        elem = elem + '<br /><strong>Airline Experience:</strong> ' + results[id].c_expAirline + ' years';

        jplangs = results[id].languages; langsStr = "";
        for (var i = 0; i < jplangs.length; i++) { 
            langsStr += jplangs[i].l_title + "/";
        }
        langsStr = langsStr.slice(0, -1);

        elem = elem + '<br /><strong>Languages:</strong> ' + langsStr;

        elem = elem + '<br /><br /><strong>Location:</strong> ' + results[id].c_city + ', ' + results[id].country_name;      
        elem = elem + '<br /><strong>Phone:</strong> ' + results[id].c_phone;
        elem = elem + '<br /><strong>Email:</strong> ' + results[id].c_email;        
        //elem = elem + '</p>';    
    }
    
    //elem = elem + '<p class="remove-app"><a class="drop-job" rel="' + results[id].crew_id + '" rel2="' + results[id].jobPost_id + '" >remove application</a></p>';

    elem = elem + '</div>';
    elem = elem + '<img class="img extend-icon" id="extendicon" onclick="openModalA(' + results[id].crew_id + ')" rel="' + results[id].crew_id + '" src="/img/extend-icon.png" alt="">';
    if (checkIfFavourite(favourites, results[id].crew_id)) { 
        //elem = elem + '<img id="fav_' + results[id].crew_id + '" rel="1" class="img favourite-icon" onclick="checkFav(' + results[id].crew_id + ',1)" src="/img/favourite-active.svg" alt="">';
    } else {
        //elem = elem + '<img id="fav_' + results[id].crew_id + '" rel="0" class="img favourite-icon" onclick="checkFav(' + results[id].crew_id + ',0)" src="/img/favourite.svg" alt="">';
    }
    elem = elem + '<div class="starred-over" rel="' + results[id].crew_id + '">Starred!</div>';

    elem = elem + '</div>';

    return elem;

}

function renderResultsCandidate(data, jpid) {
    
    console.log(data);

    totalResults = data.total;
    results = data.results;
    favourites = data.favourites;

    if (totalResults > 0) {
        // CHECK IF TO DISPLAY LOAD MORE
        if ( (paging*pageSize) >= totalResults) {
            $("#lnk_loadMore").hide();
        } else {
            $("#lnk_loadMore").show();
        }

        var elemRow = '<div class="row jobs-area">';
        elemRow = elemRow + '<div class="jp1 col-lg-6 col-md-6 col-xs-12 col-sm-12" rel="">';
        if (results.length > 0) {
            elemRow = elemRow + buildElemCandidate(results, favourites, 0, expReqFlag, expReqType);
        }
        elemRow = elemRow + '</div>';
        elemRow = elemRow + '<div class="jp1 col-lg-6 col-md-6 col-xs-12 col-sm-12" rel="">';
        if (results.length > 1) {
            elemRow = elemRow + buildElemCandidate(results, favourites, 1, expReqFlag, expReqType);        
        }
        elemRow = elemRow + '</div>';
        elemRow = elemRow + '</div>';
        elemRow = elemRow +'<div class="row jobs-area">';
        elemRow = elemRow + '<div class="jp1 col-lg-6 col-md-6 col-xs-12 col-sm-12" rel="">';
        if (results.length > 2) {
            elemRow = elemRow + buildElemCandidate(results, favourites, 2, expReqFlag, expReqType);
        }
        elemRow = elemRow + '</div>';
        elemRow = elemRow + '<div class="jp1 col-lg-6 col-md-6 col-xs-12 col-sm-12" rel="">';
        if (results.length > 3) {
            elemRow = elemRow + buildElemCandidate(results, favourites, 3, expReqFlag, expReqType);
        }
        elemRow = elemRow + '</div>';
        elemRow = elemRow + '</div>';

        $("#pnl_jobposts").append( elemRow );    
    } else {
        $("#pnl_jobposts").html("<br /><span class='text-black'>You currently have no applications to this job</span>");        
    }

}


