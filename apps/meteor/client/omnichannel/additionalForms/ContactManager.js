import { Field } from '@rocket.chat/fuselage';
import React from 'react';
import { useTranslation } from 'react-i18next';

import AutoCompleteAgent from '../../components/AutoCompleteAgent';
import { useHasLicenseModule } from '../../hooks/useHasLicenseModule';

export const ContactManager = ({ value: userId, handler }) => {
	const { t } = useTranslation();
	const hasLicense = useHasLicenseModule('livechat-enterprise');

	if (!hasLicense) {
		return null;
	}

	return (
		<Field>
			<Field.Label>{t('Contact_Manager')}</Field.Label>
			<Field.Row>
				<AutoCompleteAgent haveNoAgentsSelectedOption value={userId} onChange={handler} />
			</Field.Row>
		</Field>
	);
};

export default ContactManager;
