import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';


const events = [{
    title: 'Demo',
    start: '2026-01-18T10:00',
    end: '2026-01-18T12:00',
    backgroundColor: '#315aefff',
    borderColor: '#ffffffff'
}, {
    title: 'Stand Up',
    start: '2026-01-18',
    end: '2026-01-18',
    backgroundColor: '#315aefff',
    borderColor: '#ffffffff'
}, {
    title: 'Entrega Proyecto final',
    start: '2026-02-11',
    end: '2026-02-11',
    backgroundColor: '#315aefff',
    borderColor: '#ffffffff'
}, {
    title: 'Ulitimo Commit',
    start: '2026-02-04',
    end: '2026-02-04',
    backgroundColor: '#315aefff',
    borderColor: '#ffffffff'
}

];

function Calendar() {

    const handleEventClick = (info) => {
        if (window.confirm(`¿Eliminar el evento "${info.event.title}"?`)) {
            info.event.remove();
        }
    };

    return (
        <div className="calendar">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                initialView="dayGridMonth"

                showNonCurrentDates={false}
                fixedWeekCount={false}
                height={430}
                headerToolbar={{
                    left: 'prev,next',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,listWeek'
                }}
                buttonText={{
                    today: 'Hoy',
                    month: 'Mes',
                    week: 'Semana',
                    list: 'Agenda'
                }}
                editable
                events={events}
                eventClick={handleEventClick}
                eventColor="#0652f6ff"
                eventTextColor="#ffffff"
            />

        </div>
    );
}

export default Calendar
