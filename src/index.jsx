import ForgeUI, {
  render,
  Fragment,
  Macro,
  Text,
  Button,
  ButtonSet,
  useState,
  useProductContext,
  UserGroup,
  User
} from '@forge/ui'
import api, { route } from '@forge/api'

const fetchCommentsForContent = async (contentId) => {
  const res = await api
    .asUser()
    .requestConfluence(route`/wiki/rest/api/content/${contentId}/child/comment?expand=history.contributors`)

  const data = await res.json()
  return data.results
}

const Plead = (props) => {
  return <Text>{props.response}</Text>
}

const Leader = (props) => {
  const [state, setState] = useState({ response: '' })
  const handleYes = function () {
    setState({ response: 'Alright!' })
  }
  const handleNo = function () {
    setState({ response: 'Please?' })
  }
  return (
    <Fragment>
      <Text>Bow down to your new leader, me!</Text>
      <ButtonSet>
        <Button text="Yes" onClick={handleYes} />
        <Button text="No" onClick={handleNo} />
      </ButtonSet>
      <Plead response={state.response} />
    </Fragment>
  )
}

const App = () => {
  const context = useProductContext()
  const [comments] = useState(
    async () => await fetchCommentsForContent(context.contentId),
  )

  const content = comments.map(comment => {
    const users = []
    users.push(comment.history.createdBy);

    const contributors = comment.history.contributors
    if (contributors.publishers) {
      users.push(contributors.publishers)
    }
    
    return (<Fragment>{users.map(user => {
      return <User accountId={user.accountId}/>
    })}</Fragment>)
  })

  console.log(`Number of comments on this page: ${comments.length}`)
  return (
    <Fragment>
      <Text>Hello, Adam!</Text>
      <Leader />
      <Text>Number of comments on this page: {comments.length}</Text>
      <UserGroup>{content}</UserGroup>
    </Fragment>
  )
}

export const run = render(<Macro app={<App />} />)
