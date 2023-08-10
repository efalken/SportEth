import React from 'react'
import Logo from '../../images/asb2.png'

// eslint-disable-next-line
export default function () {
	return <a href="/">
	<img
		width={300}
		src={Logo}
		alt="logo"
		className="header-logo" />
</a>
}