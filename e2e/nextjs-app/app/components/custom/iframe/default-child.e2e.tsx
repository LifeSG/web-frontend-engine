"use client";

import { Button } from "@lifesg/react-design-system/button";
import { Form } from "@lifesg/react-design-system/form";
import { useEffect, useState } from "react";

export default function IframeDefaultChildPage() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<div>
			<Form.Input label="This is inside the iframe" />
			<Button type="submit">Submit</Button>
		</div>
	);
}
