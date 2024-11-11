import React from "react"
import ContactTable from "./ContactTable"
import Panel from "../../ui/Panels/Panel"

const ContactPanel = () => {
  return <Panel title="Contacts" fetchUrl="contacts" TableComponent={ContactTable} />
}

export default ContactPanel