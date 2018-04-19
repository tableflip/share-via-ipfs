import 'babel-polyfill'
import preact from 'preact'
import Router from 'preact-router'
import createHashHistory from 'history/createHashHistory'
import AddFiles from './components/AddFilesContainer.jsx'
import GetFiles from './components/GetFilesContainer.jsx'
import logo from './img/ipfs-logo.svg'

const App = () => (
  <div className='sans-serif'>
    <header class='db tc tl-ns pl5-m pl6-l pt3'>
      <img style='height:50px' src={logo} />
    </header>
    <div className='ph3 ph5-m ph6-l pt3 pt5-ns'>
      <Router history={createHashHistory()}>
        <AddFiles path='/' />
        <GetFiles path='/:hash' />
      </Router>
    </div>
  </div>
)

preact.render(<App />, document.getElementById('root'), document.getElementById('root').firstChild)
