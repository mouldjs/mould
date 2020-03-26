import { useState } from 'react'

if (typeof window !== 'undefined') {
    const global = window as any
    global.awesome = () => {
        const [times, setTimes] = useState(0)

        return [
            'state 0',
            {
                onClick: () => setTimes(times + 1),
                label: `click ${times} times`,
            },
        ]
    }

    global.label = ({ label }) => {
        return [
            'state 0',
            {
                label,
            },
        ]
    }

    global.t = () => {
        return [
            'state 0',
            {
                'kit 0': [{ label: 111 }, { label: 222 }, { label: 333 }],
            },
        ]
    }

    global.filterButton = ({ label, active, onToggle }) => {
        return [
            active ? 'state 1' : 'state 0',
            {
                label,
                onToggle,
            },
        ]
    }

    global.filter = ({ active, onActive }) => {
        return [
            `state 0`,
            {
                activeAll: active === 'All',
                onAll: () => onActive('All'),
                activeActive: active === 'Active',
                onActive: () => onActive('Active'),
                activeCompleted: active === 'Completed',
                onCompleted: () => onActive('Completed'),
            },
        ]
    }

    global.todoItem = ({ text, onToggle, completed }) => {
        return [
            completed ? 'state 0' : 'state 1',
            {
                text,
                onToggle,
            },
        ]
    }

    global.todoMVC = () => {
        const [inputValue, setInputValue] = useState('')
        type TODO = { text: string; completed: boolean }
        const [todos, setTodos] = useState<TODO[]>([])
        type FilterMode = 'All' | 'Active' | 'Completed'
        const [filterMode, setFilterMode] = useState<FilterMode>('All')

        return [
            'state 0',
            {
                inputValue,
                onInputChange: setInputValue,
                'kit 1': todos
                    .filter((todo) => {
                        if (filterMode === 'Active') {
                            return !todo.completed
                        } else if (filterMode === 'Completed') {
                            return todo.completed
                        }

                        return true
                    })
                    .map((todo, index) => ({
                        todoText: todo.text,
                        todoCompleted: todo.completed,
                        onToggleTodoComplete: () => {
                            const newTodos = [...todos]
                            newTodos[index].completed = !todo.completed
                            setTodos(newTodos)
                        },
                    })),
                filterMode,
                onChangeFilterMode: (mode) => setFilterMode(mode),
                onAddClick: () => {
                    setTodos([...todos, { text: inputValue, completed: false }])
                    setInputValue('')
                },
            },
        ]
    }
}
