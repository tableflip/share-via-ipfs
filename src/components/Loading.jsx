import preact from 'preact'

const msgMap = {
  connecting: 'Connecting to IPFS',
  getting: 'Requesting your files'
}

export const LoadingMsg = ({ipfsState}) => {
  return (
    <div className='pv4 tc'>
      <div className='f3 fw4 pb4'>{msgMap[ipfsState]}</div>
      <LoadingSpinner />
    </div>
  )
}

export const LoadingSpinner = () => (
  <div className='la-ball-scale-pulse center'>
    <div />
    <div />
    <div />
  </div>
)

export default LoadingMsg
