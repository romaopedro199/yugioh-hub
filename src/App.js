import React, { useEffect, useState } from 'react'
import axios from 'axios'

import './App.css'

function App () {
  const api = axios.create({
    baseURL: 'https://db.ygoprodeck.com/api/v7/'
  })

  const [cardList, setCardList] = useState(null)
  const [requesting, setRequesting] = useState(false)
  const [lastPage, setLastPage] = useState(false)

  const [filters, setFilters] = useState({
    name: '',
    offset: 0,
    sort: ''
  })

  useEffect(() => {
    loadCards(filters)
  }, [filters.offset])

  async function loadCards (filters) {
    setRequesting(true)

    try {
      const filter = formatFilters(filters)
      const res = await api.get(`cardinfo.php?${filter}`)
      setCardList(res.data.data)
      res.data.meta.pages_remaining === 0 ? setLastPage(true) : setLastPage(false)
    } catch (error) {
      setCardList(null)
    } finally {
      setRequesting(false)
    }
  }

  function formatFilters (filters) {
    let filter = '&num=12&view=List&misc=yes'

    if (filters.name !== '') {
      filter = filter + `&fname=${filters.name}`
    }

    if (filters.sort !== '') {
      filter = filter + `&sort=${filters.sort}`
    }

    filter = filter + `&offset=${filters.offset}`

    return filter
  }

  function handleChange (e) {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

  function handleFilterClick () {
    if (filters.offset > 0) {
      setFilters({
        ...filters,
        offset: 0
      })

      return
    }

    loadCards(filters)
  }

  function handlePrevPage () {
    setFilters({
      ...filters,
      offset: filters.offset - 12
    })
  }

  function handleNextPage () {
    setFilters({
      ...filters,
      offset: filters.offset + 12
    })
  }

  return (
    <>
      <div className='background' />

      <div className={`container ${requesting && 'blur'}`}>

        <div className='top-bar'>
          <h1 className='page-title'>YUGIOH <strong>HUB</strong></h1>
        </div>

        <div className='content'>

          <div className='search-box'>
            <div className='search-item'>
              <input className='form-item' placeholder='Search by card name...' name='name' onChange={handleChange} />
            </div>
            <div className='search-item'>
              <select className='form-item' name='sort' onChange={handleChange}>
                <option value=''>No Sort</option>
                <option value='new'>Newest</option>
                <option value='atk'>ATK</option>
                <option value='def'>DEF</option>
                <option value='level'>Level</option>
                <option value='name'>Name</option>
                <option value='views'>Views</option>
                <option value='upvotes'>Upvotes</option>
                <option value='downvotes'>Downvotes</option>
                <option value='price'>Price</option>
                <option value='tcg_date'>TCG Release</option>
                <option value='ocg_date'>OCG Release</option>
              </select>
            </div>
            <div className='submit'>
              <button className='button' onClick={handleFilterClick}>
                Filter
              </button>
            </div>
          </div>

          {cardList &&
            <>
              {cardList.map((item, index) => (
                <div className='card-item' key={index}>
                  <img className='card-image' src={item.card_images[0].image_url} alt='' />
                  <div className='card-info'>
                    <h3 className='card-title'>{item.name}</h3>
                    <div className='card-details'>
                      <span className='card-detail-item'>{item.type}</span>
                      {(item.atk || item.atk === 0) && <span className='card-detail-atk'>ATK: {item.atk}</span>}
                      {(item.def || item.def === 0) && <span className='card-detail-def'>DEF: {item.def}</span>}
                    </div>
                    <p className='card-description'>{item.desc}</p>
                  </div>
                </div>
              ))}
              <div className='page-nav'>
                {filters.offset > 0 &&
                  <div className='page-item'>
                    <button className='button-secondary' onClick={handlePrevPage}>
                      Prev
                    </button>
                  </div>}
                {!lastPage &&
                  <div className='page-item'>
                    <button className='button-secondary' onClick={handleNextPage}>
                      Next
                    </button>
                  </div>}
              </div>
            </>}

        </div>

      </div>

      <div className={`overlay ${requesting && 'requesting'}`} />
    </>
  )
}

export default App
