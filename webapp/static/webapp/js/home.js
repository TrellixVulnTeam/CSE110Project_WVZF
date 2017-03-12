/*****************************************************************
 *
 *  These three variables are what is needed for each API call
 *
 *****************************************************************/
var CLIENT_ID = '617019221248-anpai3721kguigchcufa4emvq19o7bmn.apps.googleusercontent.com';
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
var SCOPES = "https://www.googleapis.com/auth/calendar";

/*****************************************************************
 * Initialize Google API Client
 *****************************************************************/
function initializeClient(){
    gapi.client.init({
        discoveryDocs: DISCOVERY_DOCS,
        clientId: CLIENT_ID,
        scope: SCOPES
    });
}

/*****************************************************************
 * GLOBAL CONSTANTS
 *****************************************************************/
const ACCEPTED_DATE_FORMAT = 'YYYY-MM-DD[T]HH:mm';
const waitTime = 3000;

/*****************************************************************
 * Global variables for saveChanges()
 * changedEvent is used loosely to store an event object
 *****************************************************************/
var id;
var changedEvent;

/*****************************************************************
 * Global variables for generateEvent()
 *****************************************************************/
var startDate;
var endDate;



/*****************************************************************
 * global variables for addToCalender()
 *****************************************************************/
var todoEvent;

/*****************************************************************
 * Allows user to press enter to complete form.
 *****************************************************************/
$("#modalWindow").keyup(function(event){
    if(event.keyCode == 13){
        $(".confirmation-button").click();
    }
});

/*****************************************************************
 * Display Modal
 * Loads up a friendly form for users to edit.
 * Assigns different functions to the accept button 
 * This is done by setting the strSubmitFunc
 *****************************************************************/
function displayModal(calEvent, strSubmitFunc, eventType) {
    //Creating a Calendo Event
    if (eventType==="Create Event"){
        $('h4.eventType').text('Create Event');
        $('.confirmation-button').text('Create');

        //Create Empty Body
        //TO DO
        $('#event-name-input').val('');
        $('#start-time-input').val(startDate);
        var endDate = moment(startDate).add(1,'hours').format();
        console.log(endDate);
        $('#end-time-input').val(moment(endDate).format(ACCEPTED_DATE_FORMAT));
        $('#location-input').val('');
        $('#description-input').val('');
        $(".confirmation-button").attr("onclick",strSubmitFunc);
        $("#url").hide();
        $('.delete-button').hide();
    } else{
        //Calendo Event
        if(calEvent.id=="external-event"){

            $('h4.eventType').text('Add to Calendar');
            $('.confirmation-button').text('Add');

            //Body
            $('#event-name-input').val(calEvent.title);
            //TODO: check if start time is indicated
            $('#start-time-input').val(calEvent.start);
            $('#end-time-input').val(calEvent.end);
            $('#location-input').val(calEvent.location);
            $('#description-input').val(calEvent.description);
            $(".confirmation-button").attr("onclick",strSubmitFunc);
            $("#url").hide();
            $('.delete-button').hide();
        }
        //Google Calendar Event
        else{
            //set global var to remember the GCal ID
            id=calEvent.id;
            console.log(id);
            //Case where it already exists on Google Calendar
            $('h4.eventType').text('Edit Event');
            $('.confirmation-button').text('Save Changes');

            //Body
            $('#event-name-input').val(calEvent.title);
            $('#start-time-input').val(calEvent.start.format(ACCEPTED_DATE_FORMAT));
            $('#end-time-input').val(calEvent.end.format(ACCEPTED_DATE_FORMAT));
            $('#location-input').val(calEvent.location);
            $('#description-input').val(calEvent.description);
            $(".confirmation-button").attr("onclick",strSubmitFunc);
            console.log(calEvent.url);
            $("#url").attr("href",""+calEvent.url);
            $("#url").show();
            $('.delete-button').show();
        }
    }

    $("#modalWindow").modal();
    $("#dynamicModal").modal('show');
}

/*****************************************************************
 * Display Modal asking User to confirm delete
 *****************************************************************/
function confirmDelete(){
    $(".bs-example-modal-sm").modal('show');
}

/*****************************************************************
 * Delete Event
 * Occurs only when user confirms delete from confirmDelete()
 * confirmDelete() is only triggered when user clicks delete
 * from an Edit Event modal or if user drag event outside to
 * the trash can
 *****************************************************************/
function deleteEvent(){
    $("#bs-example-modal-sm").modal('hide');
    try{
        //executing google remove first
        initializeClient();
        gapi.client.calendar.events.delete({
            'calendarId': 'primary',
            'eventId': changedEvent.id,
        }).execute();
        //removes from local calendar as well
        $('#calendar').fullCalendar('removeEvents', changedEvent.id);

        $("#modalWindow").modal('hide');
        //display success message
        $("#event-remove-success").slideDown();
        setTimeout(function(){ $("#event-remove-success").slideUp(); }, waitTime);
    }
    catch(e){
        console.log(e);
        displayError();
    }
}

/*****************************************************************
 * Hide
 * Hides the Alert
 * Reason I hide all alerts in the same function is because
 * they auto hide after 3 seconds anyways.
 *****************************************************************/
function hide(){
    $("#event-add-success").slideUp();
    $("#event-create-success").slideUp();
    $("#event-change-success").slideUp();
    $("#event-failure").slideUp();
    $("#event-remove-success").slideUp();
    $("#event-move-success").slideUp();
    $("#event-resize-success").slideUp();
}

/*****************************************************************
 * Display Error if try catch fails.
 *****************************************************************/
function displayError(){
    $("#modalWindow").modal('hide');
    $("#event-failure").slideDown();
    setTimeout(function(){ hide();}, waitTime);
}

/*****************************************************************
 * Initialize External To-Do List and Full Calendar View
 *****************************************************************/
$(document).ready(function() {
    //External Events
    $('#external-events .fc-event').each(function() {

        //Initializing external event.
        $(this).data('event', {
            title: $.trim($(this).text()), // use the element's text as the event title
            stick: true, // maintain when user navigates (see docs on the renderEvent method)
            id: 'external-event', //give the event id so that it gets removed 
        });

        //This is what happens when you click the external event
        $(this).click(function(){
            //Add your functionality here
        });

        // make the event draggable using jQuery UI revert, if let go, will go back to its position
        $(this).draggable({
            zIndex: 999,
            revert: true,
        });

    });


    //Initialize the Calendar
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listWeek'

        },
        defaultView: 'month', //can use any of the following 'month,agendaWeek,agendaDay,listWeek'
        //dragRevertDuration: 0, //uncomment this one to make it not revert to original position
        editable: true,
        droppable: true, //this allows things to be dropped onto the calendar.
        slotLabelFormat:"HH:mm", //Format display of hours

        //API key created by William
        googleCalendarApiKey: 'AIzaSyD0XdpABM5YzCNI0QFP_Gm7mgqDuNzqy7M',

        /*****************************************************************
         * Event Resize
         * WHEN EVENT IS RESIZED NOT IN MONTH VIEW
         * No need to use Modals.
         *****************************************************************/
        eventResize: function(event, delta, revertFunc) {
            try{
                initializeClient();
                //If event is a GCal Event. This is determined by event having both id+url
                if(event.id!==undefined && event.url!==undefined){
                    var toPushEvent = {
                        'summary': event.title,
                        'description': event.description,
                        'location': event.location,
                        'start': {
                            'dateTime': event.start.format(),
                            'timeZone': 'America/Los_Angeles'
                        },
                        'end': {
                            'dateTime': event.end.format(),
                            'timeZone': 'America/Los_Angeles'
                        }
                    };  
                    gapi.client.calendar.events.update({
                        'calendarId': 'primary',
                        'eventId': event.id,
                        'resource': toPushEvent
                    }).execute();
                }
                $("#event-resize-success").slideDown();
            }catch(e){
                console.log(e);
                $("#event-failure").slideDown();
            }
        },
        /*****************************************************************
         * Event Drop
         * WHEN EVENT IS DRAGGED AND DROPPED WITHIN CALENDAR
         * No need to use Modals.
         *****************************************************************/
        eventDrop: function(event, delta, revertFunc) {
            initializeClient();
            if(event.id!==undefined && event.url!==undefined){
                var toPushEvent = {
                    summary: event.title,
                    'start': {
                        'dateTime': event.start.format(),
                        'timeZone': 'America/Los_Angeles'
                    },
                    'end': {
                        'dateTime': event.end.format(),
                        'timeZone': 'America/Los_Angeles'
                    }
                };  
                gapi.client.calendar.events.update({
                    'calendarId': 'primary',
                    'eventId': event.id,
                    'resource': toPushEvent
                }).execute();
            }
            $("#event-move-success").slideDown();
            setTimeout(function(){ hide();}, waitTime);

        },
        /*****************************************************************
         * Drop
         * WHEN AN EXTERNAL EVENT IS DROPPED ONTO THE CALENDAR
         * Uses Modal
         *****************************************************************/
        drop: function(date, allDay) {

            todoEvent = $(this);
            startDate = date.format(ACCEPTED_DATE_FORMAT);
            var defaultDuration = moment.duration($('#calendar').fullCalendar('option', 'defaultTimedEventDuration'));
            endDate = date.clone().add(defaultDuration).format(ACCEPTED_DATE_FORMAT); 
            changedEvent = $(this).data('event');
            changedEvent.start = date.format(ACCEPTED_DATE_FORMAT);
            changedEvent.end = date.clone().add(defaultDuration).format(ACCEPTED_DATE_FORMAT);
            $("#calendar").fullCalendar('removeEvents', 'external-event');
            displayModal(changedEvent, "addToCalendar()", "Add To Calendar");

        },
        /*****************************************************************
         * Day Click
         * WHEN A DAY IS CLICKED: CREATE NEW EVENT
         * Uses Modal
         *****************************************************************/
        dayClick: function(date, jsEvent, view) {              
            //easter egg
            if(date.format("MM:DD")==="04:20"){

                var win = window.open("https://www.youtube.com/watch?v=XtECttp9WUk", '_blank');
                win.focus();
            } 
            startDate = date.format(ACCEPTED_DATE_FORMAT);
            displayModal(undefined, "generateEvent()", "Create Event");

        },

        /*****************************************************************
         * Event Click
         * WHEN A CREATED EVENT IS CLICKED: CREATE NEW EVENT
         * Precondition: Event is already a Google Calendar Event
         * Uses Modal
         *****************************************************************/
        eventClick: function(calEvent, jsEvent, view) {
            changedEvent = calEvent;
            id=calEvent.id;
            displayModal(calEvent, "saveChanges()", "Save Changes");
            return false;
        },
        /*****************************************************************
         * Event Drag Stop 
         * USED FOR DELETING EVENT VIA DRAGGING!
         * Uses Confirmation Modal
         *****************************************************************/
        eventDragStop: function(event,jsEvent) {
            var trashEl = jQuery('#calendarTrash');
            var ofs = trashEl.offset();

            var x1 = ofs.left;
            var x2 = ofs.left + trashEl.outerWidth(true);
            var y1 = ofs.top;
            var y2 = ofs.top + trashEl.outerHeight(true);

            if (jsEvent.pageX >= x1 && jsEvent.pageX<= x2 &&
                jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {
                changedEvent=event;
                confirmDelete(); 
            }
        }

    });
});


/*****************************************************************
 * GENERATE EVENT
 * Called by DayClick
 * Trigger: User wants to create an event and clicks on Day
 * Precondition: No events exist, no field is filled
 * Postcondition: Event Created on both Calendar
 * Uses Google Calendar API
 *****************************************************************/
function generateEvent(){
    try{
        initializeClient();
        var gCalEvent = {
            'summary': $('#event-name-input').val(),
            'location': $('#location-input').val(),
            'description': $('#description-input').val(),
            'start': {
                'dateTime': $('#start-time-input').val()+':00.00',
                'timeZone': 'America/Los_Angeles'
            },
            'end': {
                'dateTime': $('#end-time-input').val()+':00.00'            ,
                'timeZone': 'America/Los_Angeles'
            },
            'reminders': {
                'useDefault': false,
                'overrides': [
                    {'method': 'email', 'minutes': 24 * 60},
                    {'method': 'popup', 'minutes': 10}
                ]
            }
        };  
        gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': gCalEvent
        }).execute(function(resp){
            var newTitle = $('#event-name-input').val()
            var calendoEvent = {
                id: resp.id,
                url: resp.htmlLink,
                title: newTitle==""?"(No Title)":newTitle, 
                start: $('#start-time-input').val(),
                end: $('#end-time-input').val(),
                location: $('#location-input').val(),
                description: $('#description-input').val()
            }
            $('#calendar').fullCalendar('renderEvent', calendoEvent,stick=true);
            $('#calendar').fullCalendar('addEventSource', calendoEvent);
        })



        //close the modal window after completion
        $("#modalWindow").modal('hide');

        //succuess notification
        $("#event-create-success").slideDown();
        setTimeout(function(){ hide();}, waitTime);
    }catch(e){
        console.log(e);
        displayError();
    }
}

/*****************************************************************
 * ADD TO CALENDAR
 * Called by Drop
 * Trigger: User wants to add TO DO to Calendar
 * Precondition: No events exist, user already created TODO event
 * Postcondition: Event Created on both Calendars
 * Uses Google Calendar API
 *****************************************************************/
function addToCalendar(){
    try{
        initializeClient();
        var gCalEvent = {
            'summary': $('#event-name-input').val(),
            'location': $('#location-input').val(),
            'description': $('#description-input').val(),
            'start': {
                'dateTime': $('#start-time-input').val()+':00.00',
                'timeZone': 'America/Los_Angeles'
            },
            'end': {
                'dateTime': $('#end-time-input').val()+':00.00'            ,
                'timeZone': 'America/Los_Angeles'
            },
            'reminders': {
                'useDefault': false,
                'overrides': [
                    {'method': 'email', 'minutes': 24 * 60},
                    {'method': 'popup', 'minutes': 10}
                ]
            }
        };  


        gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': gCalEvent
        }).execute(function(resp){
            changedEvent.start=$('#start-time-input').val();
            changedEvent.end=$('#end-time-input').val();
            var newTitle = $('#event-name-input').val();
            changedEvent.title = newTitle==""?"(No Title)":newTitle;
            changedEvent.description = $('#description-input').val()
            changedEvent.location = $('#location-input').val()
            changedEvent.url=resp.htmlLink;
            changedEvent.id=resp.id;
            $('#calendar').fullCalendar('renderEvent', changedEvent,stick=true);
        });

        //Remove from todolist event
        //Will not trigger if user does not click button.
        todoEvent.remove();

        //close the modal window after completion
        $("#modalWindow").modal('hide');

        //success notification
        $("#event-add-success").slideDown();
        setTimeout(function(){ hide();}, waitTime);
    }catch(e){
        console.log(e);
        displayError();
    }
}
/*****************************************************************
 * SAVE CHANGED
 * Called by Event Click
 * Trigger: User wants to edit event
 * Precondition: Event exists on both calendars
 * Postcondition: Event is changed/remain the same and changes 
 * show on both calendars
 * Uses Google Calendar API
 *****************************************************************/
function saveChanges() {
    try{
        initializeClient();
        
        changedEvent.start=$('#start-time-input').val();
        changedEvent.end=$('#end-time-input').val();
        var newTitle = $('#event-name-input').val();
        changedEvent.title = newTitle==""?"(No Title)":newTitle;
        changedEvent.description = $('#description-input').val()
        changedEvent.location = $('#location-input').val()
        
        $('#calendar').fullCalendar('updateEvent', changedEvent);

        var gCalEvent = {
            'summary': $('#event-name-input').val(),
            'location': $('#location-input').val(),
            'description': $('#description-input').val(),
            'start': {
                'dateTime': $('#start-time-input').val()+':00.00',
                'timeZone': 'America/Los_Angeles'
            },
            'end': {
                'dateTime': $('#end-time-input').val()+':00.00',
                'timeZone': 'America/Los_Angeles'
            },
            'reminders': {
                'useDefault': false,
                'overrides': [
                    {'method': 'email', 'minutes': 24 * 60},
                    {'method': 'popup', 'minutes': 10}
                ]
            }
        };
        

        gapi.client.calendar.events.update({
            'calendarId': 'primary',
            'eventId':id,
            'resource': gCalEvent
        }).execute();
        //close the modal window after completion
        $("#modalWindow").modal('hide');
        //display success message
        $("#event-change-success").slideDown();
        setTimeout(function(){ hide();}, waitTime);
    }catch(e){
        console.log(e);
        displayError();
    }
}



	  $('input').blur(function() {
    if ($(this).val())
      $("label[for='"+$(this).attr('id')+"']").addClass('used');
    else
      $("label[for='"+$(this).attr('id')+"']").removeClass('used');
  });
