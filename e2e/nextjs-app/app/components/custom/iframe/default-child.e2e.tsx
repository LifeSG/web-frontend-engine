"use client";

import { Button } from "@lifesg/react-design-system/button";
import { Form } from "@lifesg/react-design-system/form";

export default function IframeDefaultChildPage() {
	return (
		<div>
			<Form.Input label="This is inside the iframe" />
			<Button type="submit">Submit</Button>
		</div>
	);
}
