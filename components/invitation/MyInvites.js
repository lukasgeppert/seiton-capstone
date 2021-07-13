import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchInvitations } from '../../store/invitationsSlice'
import { fetchUpdateInvite } from '../../store/invitationSlice'
import SendInviteModal from './SendInviteModal'

export default function MyInvites() {
  const invitations = useSelector(state => state.invitations)
  const dispatch = useDispatch()
  const [isLoading, setLoading] = useState(true)
  const [show, setShow] = useState(false)
  const [isInviteResponded, setInviteResponded] = useState(false)
  const sentInvites = invitations.sentInvites || []
  const receivedInvites = invitations.receivedInvites || []
  //received invites
  const pendingReceivedInvites = receivedInvites.filter(
    invite => invite.status === 'PENDING'
  )
  const historyReceivedInvites = receivedInvites.filter(
    invite => invite.status !== 'PENDING'
  )

  //sent invites
  const pendingSentInvites = sentInvites.filter(
    invite => invite.status === 'PENDING'
  )
  const historySentInvites = sentInvites.filter(
    invite => invite.status !== 'PENDING'
  )

  useEffect(() => {
    dispatch(fetchInvitations())
    setLoading(false)
  }, [dispatch])

  const handleResponse = (invite, value) => {
    const thunkArg = { invite, value }
    dispatch(fetchUpdateInvite(thunkArg))
    setInviteResponded(true)
  }

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  return (
    <React.Fragment>
      <button
        type="submit"
        className="bg-gray-300 text-gray-900 rounded hover:bg-gray-200 p-4 py-2 focus:outline-none"
        onClick={() => setShow(true)}
      >
        Send Invite!
      </button>
      <div>
        <section className="ml-6">
          <h1 className="text-xl">Pending Invites</h1>
          {pendingReceivedInvites.map(invite => (
            <div className="my-3" key={invite.id}>
              <p>
                You received an invitation from {invite.sentFrom.name} to join
                project {invite.project.name}
              </p>
              <p>{invite.status}</p>

              <div>
                <button
                  type="submit"
                  className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
                  value="ACCEPTED"
                  onClick={e => handleResponse(invite, e.target.value)}
                >
                  Accept
                </button>
                <button
                  type="submit"
                  className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
                  value="DECLINED"
                  onClick={e => handleResponse(invite, e.target.value)}
                >
                  Deny
                </button>
              </div>
            </div>
          ))}

          {pendingSentInvites.map(invite => (
            <div className="my-3" key={invite.id}>
              <p>
                You sent an invitation to {invite.receivedBy.name} to join
                project {invite.project.name}
              </p>
            </div>
          ))}
        </section>

        <section className="ml-6">
          <h1 className="text-xl">History</h1>
          {historyReceivedInvites.map(invite => (
            <div className="my-3" key={invite.id}>
              <p>
                You were invited by {invite.sentFrom.name} to join project{' '}
                {invite.project.name}
              </p>
              <p>{invite.status}</p>
            </div>
          ))}

          {historySentInvites.map(invite => (
            <div className="my-3" key={invite.id}>
              <p>
                You invited {invite.receivedBy.name} to join project
                {invite.project.name}
              </p>
              <p>{invite.status}</p>
            </div>
          ))}
        </section>
      </div>
      <SendInviteModal show={show} onClose={() => setShow(false)} />
    </React.Fragment>
  )
}
