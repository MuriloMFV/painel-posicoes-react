import { useState, useEffect, useMemo } from 'react'

import { IoIosSpeedometer, IoIosDesktop } from "react-icons/io";

import { FaReact } from "react-icons/fa";



const API_URL = 'http://localhost:4000/posicoes'



function Spinner() {

  return (

    <div className="flex justify-center my-6">

      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

    </div>

  )

}



function App() {

  const [data, setData] = useState([])

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState(null)



  // Filtros

  const [filterTipo, setFilterTipo] = useState('Todos')

  const [filterIgnicao, setFilterIgnicao] = useState('Todos')



  // Ordenação

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })



  // Recarregar dados

  const fetchData = async () => {

    setLoading(true)

    setError(null)

    try {

      await new Promise(r => setTimeout(r, 1000))

      const res = await fetch(API_URL)

      if (!res.ok) throw new Error('Erro ao buscar dados')

      const json = await res.json()



      // Normaliza dados

      const normalizedData = json.map(d => ({

        ...d,

        tipo: d.tipo ? d.tipo.trim().toUpperCase() : '',

        ignicao: d.ignicao === true || (typeof d.ignicao === 'string' && d.ignicao.toUpperCase().startsWith('S'))

      }))



      setData(normalizedData)

    } catch (e) {

      setError(e.message)

    } finally {

      setLoading(false)

    }

  }



  useEffect(() => {

    fetchData()

  }, [])



  // Filtros

  const filteredData = useMemo(() => {

    return data.filter(item => {

      const tipoOk = filterTipo === 'Todos' || item.tipo === filterTipo.toUpperCase()

      const ignicaoOk = filterIgnicao === 'Todos' || (filterIgnicao === 'Sim' ? item.ignicao : !item.ignicao)

      return tipoOk && ignicaoOk

    })

  }, [data, filterTipo, filterIgnicao])



  // Ordenação

  const sortedData = useMemo(() => {

    if (!sortConfig.key) return filteredData

    const sorted = [...filteredData].sort((a, b) => {

      let aVal = a[sortConfig.key]

      let bVal = b[sortConfig.key]



      if (sortConfig.key === 'ignicao') {

        aVal = aVal ? 1 : 0

        bVal = bVal ? 1 : 0

      }



      if (sortConfig.key === 'dataHora') {

        aVal = aVal ? new Date(aVal).getTime() : 0

        bVal = bVal ? new Date(bVal).getTime() : 0

      }



      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1

      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1

      return 0

    })

    return sorted

  }, [filteredData, sortConfig])



  // Velocidade média

  const velocidadeMedia = useMemo(() => {

    if (filteredData.length === 0) return 0

    const soma = filteredData.reduce((acc, cur) => acc + (cur.velocidade || 0), 0)

    return Math.round(soma / filteredData.length)

  }, [filteredData])



  // Função para mudar ordenação

  const handleSort = (key) => {

    setSortConfig(prev => {

      if (prev.key === key) {

        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }

      }

      return { key, direction: 'asc' }

    })

  }



  return (

    <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg min-h-screen flex flex-col justify-center">

      <h1 className="text-4xl font-extrabold text-teal-700 mb-6 text-center drop-shadow-md">

        <FaReact className="inline text-teal-700" />  Desafio Posições - React  <FaReact className="inline text-teal-700" />

      </h1>



      <HeaderSummary total={filteredData.length} velocidadeMedia={velocidadeMedia} />



      <Filters

        filterTipo={filterTipo}

        setFilterTipo={setFilterTipo}

        filterIgnicao={filterIgnicao}

        setFilterIgnicao={setFilterIgnicao}

      />



      <div className="mb-6 flex justify-center">

        <button

          onClick={fetchData}

          disabled={loading}

          className="px-5 py-2 bg-teal-700 text-white rounded-md shadow-md hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"

        >

          Recarregar dados

        </button>

      </div>



      {loading && <Spinner />}

      {error && <p className="text-center text-red-600">Erro: {error}</p>}

      {!loading && !error && sortedData.length === 0 && <p className="text-center text-gray-600">Nenhum registro encontrado.</p>}



      {!loading && !error && sortedData.length > 0 && (

        <PositionsTable data={sortedData} onSort={handleSort} sortConfig={sortConfig} />

      )}

    </div>

  )

}



// Componentes auxiliares continuam iguais

function HeaderSummary({ total, velocidadeMedia }) {

  return (

    <div className="flex flex-col sm:flex-row justify-between bg-teal-600 text-teal-50 p-5 rounded-lg shadow-md mb-6 gap-4">

      <div className="flex items-center gap-3">

        <IoIosDesktop />

        <span className="font-semibold text-lg">Total de registros: <strong>{total}</strong></span>

      </div>

      <div className="flex items-center gap-3">

        <IoIosSpeedometer />

        <span className="font-semibold text-lg">Velocidade média: <strong>{velocidadeMedia} km/h</strong></span>

      </div>

    </div>

  )

}



function Filters({ filterTipo, setFilterTipo, filterIgnicao, setFilterIgnicao }) {

  return (

    <div className="flex flex-wrap gap-6 mb-6 justify-center">

      <div>

        <label className="block font-semibold mb-2 text-gray-700" htmlFor="tipo">Tipo</label>

        <select

          id="tipo"

          value={filterTipo}

          onChange={e => setFilterTipo(e.target.value)}

          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"

        >

          <option value="Todos">Todos</option>

          <option value="CARRO">CARRO</option>

          <option value="MOTO">MOTO</option>

          <option value="CARRETA">CARRETA</option>

        </select>

      </div>



      <div>

        <label className="block font-semibold mb-2 text-gray-700" htmlFor="ignicao">Ignição</label>

        <select

          id="ignicao"

          value={filterIgnicao}

          onChange={e => setFilterIgnicao(e.target.value)}

          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"

        >

          <option value="Todos">Todos</option>

          <option value="Sim">Ligada</option>

          <option value="Não">Desligada</option>

        </select>

      </div>

    </div>

  )

}



function PositionsTable({ data, onSort, sortConfig }) {

  const getSortIndicator = (key) => {

    if (sortConfig.key !== key) return null

    return sortConfig.direction === 'asc' ? '▲' : '▼'

  }



  const headerClass = (key) =>

    `cursor-pointer px-6 py-3 text-left font-semibold select-none ${sortConfig.key === key ? 'bg-teal-600 text-white' : 'bg-teal-700 text-white'

    }`



  return (

    <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">

      <table className="min-w-full divide-y divide-gray-200">

        <thead>

          <tr>

            <th className={headerClass('identificador')} onClick={() => onSort('identificador')}>

              Identificador {getSortIndicator('identificador')}

            </th>

            <th className={headerClass('tipo')} onClick={() => onSort('tipo')}>

              Tipo {getSortIndicator('tipo')}

            </th>

            <th className="px-6 py-3 text-left font-semibold bg-teal-700 text-white">Latitude</th>

            <th className="px-6 py-3 text-left font-semibold bg-teal-700 text-white">Longitude</th>

            <th className={headerClass('velocidade')} onClick={() => onSort('velocidade')}>

              Velocidade {getSortIndicator('velocidade')}

            </th>

            <th className={headerClass('ignicao')} onClick={() => onSort('ignicao')}>

              Ignição {getSortIndicator('ignicao')}

            </th>

            <th className={headerClass('odometro')} onClick={() => onSort('odometro')}>

              Odômetro {getSortIndicator('odometro')}

            </th>

            <th className={headerClass('dataHora')} onClick={() => onSort('dataHora')}>

              Data/Hora {getSortIndicator('dataHora')}

            </th>

          </tr>

        </thead>

     <tbody className="bg-white divide-y divide-gray-200">
  {data.map((pos) => (
    <tr
      key={`${pos.identificador}-${pos.dataHora}`}
      className="hover:bg-blue-50 hover:shadow-md transition duration-200"
    >
      <td className="px-6 py-4 whitespace-nowrap">{pos.identificador}</td>
      <td className="px-6 py-4 whitespace-nowrap">{pos.tipo}</td>
      <td className="px-6 py-4 whitespace-nowrap">{pos.latitude}</td>
      <td className="px-6 py-4 whitespace-nowrap">{pos.longitude}</td>
      <td className="px-6 py-4 whitespace-nowrap">{pos.velocidade}</td>
      <td className="px-6 py-4 whitespace-nowrap">{pos.ignicao ? 'Sim' : 'Não'}</td>
      <td className="px-6 py-4 whitespace-nowrap">{pos.odometro}</td>
      <td className="px-6 py-4 whitespace-nowrap">{new Date(pos.dataHora).toLocaleString('pt-BR')}</td>
    </tr>
  ))}
</tbody>

      </table>

    </div>

  )

}



export default App