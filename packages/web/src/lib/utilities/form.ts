type FormField =
	| {
			name: string;
			type: 'text' | 'number' | 'email';
			required: boolean;
			label?: string;
	  }
	| {
			name: string;
			type: 'select';
			required: boolean;
			options: string[];
	  }
	| {
			name: string;
			type: 'checkbox';
			required: boolean;
	  };

export type JsonSchema = {
	type?: string;
	properties?: Record<string, JsonSchema>;
	required?: string[];
	enum?: string[];
	title?: string;
};

export function form(schema: JsonSchema): FormField[] {
	if (schema.type !== 'object' || !schema.properties) {
		return [];
	}

	const required = new Set(schema.required || []);

	return Object.entries(schema.properties).map(([name, property]) => {
		const isRequired = required.has(name);

		if (property.enum) {
			return {
				name,
				type: 'select',
				required: isRequired,
				options: property.enum
			};
		}

		switch (property.type) {
			case 'boolean':
				return {
					name,
					type: 'checkbox',
					required: isRequired
				};

			case 'number':
				return {
					name,
					type: 'number',
					required: isRequired
				};

			default:
				return {
					name,
					type: 'text',
					required: isRequired
				};
		}
	});
}
