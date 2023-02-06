import { useState, useEffect, useCallback } from 'react';
import { BiCalendar } from 'react-icons/bi';
import AddAppointment from './components/AddAppointment';
import AppointmentInfo from './components/AppointmentInfo';
import Search from './components/Search';

function App() {

  const [ appointmentList, setAppointmentList ] = useState([])
  const [ query, setQuery ] = useState('')
  const [ orderBy, setOrderBy ] = useState('asc')
  const [ sortBy, setSortBy ] = useState('petName')

  const filteredAppointmentList = appointmentList.filter(apt => {
    return(
      apt.petName.toLowerCase().includes(query.toLowerCase()) ||
      apt.ownerName.toLowerCase().includes(query.toLowerCase()) ||
      apt.aptNotes.toLowerCase().includes(query.toLowerCase())
    )
  }).sort((a, b) => {
    let order = orderBy.toLowerCase() === 'asc' ? 1 : -1;
    return a[sortBy] < b[sortBy] ? -1 * order : 1 * order;
  })

  const fetchData = useCallback(() => {
    fetch('./data.json')
      .then(res => res.json())
      .then(data => setAppointmentList(data));
  }, [])

  useEffect(() => {
    fetchData();
  }, [fetchData])

  return (
    <div className='App container mx-auto my-3 font-thin'>
      <h1 className="text-5xl my-3">
        <BiCalendar className='inline-block text-red-400 align-top'/>Your Appointments
      </h1>
      <AddAppointment 
        maxId={appointmentList.reduce((max, item)=>{return item.id > max ? item.id : max;}, 0)}
        onAddAppointment={newApt => setAppointmentList([...appointmentList, newApt])}/>
      <Search 
        query={query} 
        onQueryChange={(q) => setQuery(q)}
        orderBy={orderBy}
        onOrderChange={(order) => setOrderBy(order)}
        sortBy={sortBy}
        onSortChange={(sort) => setSortBy(sort)}/>

      <ul className="divide-y divide-gray-200">
        {
          filteredAppointmentList.map(appointment => (
            <AppointmentInfo 
              key={appointment.id} 
              appointment={appointment}
              onDelete={(id) => setAppointmentList(appointmentList.filter(apt => apt.id !== id)) }/>
          ))
        }
      </ul>
    </div>
  )
}

export default App
