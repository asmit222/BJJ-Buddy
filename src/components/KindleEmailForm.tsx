import React from 'react'
import Form from 'react-bootstrap/Form'

interface KindleEmailFormProps {
  kindleEmail: string
  isNotValidEmail: (email: string) => boolean
  showKindleEmailForm: boolean
  setSideNavStatus: (status: string) => void
  setKindleEmailAndSave: (e: any) => void
  handleShowKindleEmailForm: (show: boolean) => void
  kindleFormFieldClassName: string
}

const KindleEmailForm: React.FC<KindleEmailFormProps> = (props) => {
  const {
    kindleEmail,
    isNotValidEmail,
    showKindleEmailForm,
    setSideNavStatus,
    setKindleEmailAndSave,
    handleShowKindleEmailForm,
    kindleFormFieldClassName
  } = props

  return (
    <div className='kindleEmailFormContainer'>
      {isNotValidEmail(kindleEmail) || showKindleEmailForm ? (
        <Form className='kindleEmailAddressForm'>
          <div className='kindleEmailAddressFormInner'>
            <Form.Group controlId='formBasicEmail' className='mb-3'>
              <Form.Label className='kindleEmailAddressTitle'>
                <span className='higherFontWeight'>Kindle email address</span>
                {!isNotValidEmail(kindleEmail) && (
                  <i className='fa-solid fa-check fa-circle-check2'></i>
                )}
              </Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                className={kindleFormFieldClassName}
                value={kindleEmail}
                onClick={() => setSideNavStatus('sideNavClosed')}
                onChange={(e) => setKindleEmailAndSave(e)}
              />
            </Form.Group>
          </div>
        </Form>
      ) : (
        <div
          className='stickyEmailIconSide'
          onClick={() => handleShowKindleEmailForm(true)}
        >
          {kindleEmail}
        </div>
      )}
    </div>
  )
}

export default KindleEmailForm
