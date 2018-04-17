import 'babel-polyfill'
import preact from 'preact'
import Router from 'preact-router'
import createHashHistory from 'history/createHashHistory'
import AddFiles from './components/AddFilesContainer.jsx'
import GetFiles from './components/GetFilesContainer.jsx'

const App = () => (
  <div className='sans-serif'>
    <div className='pa2 pa5-m pa6-l'>
      <Router history={createHashHistory()}>
        <AddFiles path='/' />
        <GetFiles path='/:hash' />
      </Router>
    </div>
  </div>
)

preact.render(<App />, document.getElementById('root'), document.getElementById('root').firstChild)
