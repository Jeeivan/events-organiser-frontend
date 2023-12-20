import { useParams } from 'react-router-dom'

export default function Group() {
    const { groupCode } = useParams()
  return (
    <div>Group {groupCode}</div>
  )
}
