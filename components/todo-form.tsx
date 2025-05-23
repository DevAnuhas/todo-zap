"use client";

import React from "react";
import { FormEvent, useRef } from "react";
import { useFormStatus } from "react-dom";
import { TodoOptimisticUpdate } from "./todo-list";
import { Todo } from "@/types/custom";
import { addTodo } from "@/app/todos/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

function FormContent() {
	const { pending } = useFormStatus();
	return (
		<>
			<Textarea
				disabled={pending}
				minLength={4}
				name="text"
				required
				placeholder="Add a new todo"
			/>
			<Button disabled={pending} type="submit" className="ml-auto">
				<Plus className="h-5 w-5" />
				Create Todo
			</Button>
		</>
	);
}

export function TodoForm({
	optimisticUpdate,
}: {
	optimisticUpdate: TodoOptimisticUpdate;
}) {
	const formRef = useRef<HTMLFormElement>(null);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(formRef.current!);
		const newTodo: Todo = {
			id: -1,
			inserted_at: "",
			user_id: "",
			task: formData.get("text") as string,
			is_complete: false,
		};

		React.startTransition(() => {
			optimisticUpdate({ action: "create", todo: newTodo });
		});

		await addTodo(formData);
		formRef.current?.reset();
	}

	return (
		<Card>
			<CardContent className="">
				<form
					ref={formRef}
					className="flex flex-col gap-4"
					onSubmit={handleSubmit}
				>
					<FormContent />
				</form>
			</CardContent>
		</Card>
	);
}
