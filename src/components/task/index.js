import { useState } from 'react';
import {
	getYearMonthDayString,
	isAfterToday,
	isBeforeToday,
} from '../../dates/';
import {
	ContentEditable,
	IconButton,
} from '../';
import { classnames } from '../../utils';
import './index.scss';

const Task = ({
	id,
	value,
	date,
	order,
	canMoveUp,
	canMoveDown,
	isComplete,
	dispatch,
}) => {
	const [isFocused, setIsFocused] = useState(false);

	const taskDateObj = new Date(`${ date }T00:00:00`);

	return (
		<div
			className={ classnames(
				'c-task',
				`is-order-${ order + 1 }`,
				isComplete ? 'is-complete' : '',
				isFocused ? 'is-focused' : ''
			) }
		>
			<ContentEditable
				className="c-task__edit"
				value={ value }
				disabled={ isBeforeToday(date) }
				onChangeFocus={ (state) => setIsFocused(state) }
				onSave={ (value) => {
					if (value === '') {
						dispatch({
							type: 'remove',
							id: id,
							date: date,
							order: order,
						});
					}
					else {
						dispatch({
							type: 'update',
							id: id,
							value: value.trim(),
						});
					}
				} }
				onEsc={ (ref) => ref.current.innerText = value }
			/>
			<div className="c-task__actions">
				{ !isBeforeToday(date) && (
					<IconButton
						label={ isComplete ? 'Mark incomplete' : 'Mark complete' }
						icon={ isComplete ? 'checkmarkIncomplete' : 'checkmark' }
						onClick={ () => dispatch({
							type: 'toggleComplete',
							id: id,
						}) }
						onFocusChange={ (value) => setIsFocused(value) }
					/>
				) }
				<IconButton
					label="Delete"
					icon="trash"
					onClick={ () => {
						if (window.confirm(`Delete “${ value }”?`)) {
							dispatch({
								type: 'remove',
								id: id,
								date: date,
								order: order,
							});
						}
					} }
					onFocusChange={ (value) => setIsFocused(value) }
				/>
				{ !isComplete && !isBeforeToday(date) && (
					<>
						<IconButton
							label="Move Up"
							icon="arrowUp"
							disabled={ canMoveUp ? null : true }
							onClick={ () => dispatch({
								type: 'moveToPosition',
								id: id,
								date: date,
								from: order,
								to: order - 1,
							}) }
							onFocusChange={ (value) => setIsFocused(value) }
						/>
						<IconButton
							label="Move Down"
							icon="arrowDown"
							disabled={ canMoveDown ? null : true }
							onClick={ () => dispatch({
								type: 'moveToPosition',
								id: id,
								date: date,
								from: order,
								to: order + 1,
							}) }
							onFocusChange={ (value) => setIsFocused(value) }
						/>
						{ isAfterToday(taskDateObj) ? (
							<IconButton
								label="Move to today"
								icon="arrowLeft"
								onClick={ () => dispatch({
									type: 'moveToDate',
									id: id,
									order: order,
									from: date,
									to: getYearMonthDayString(new Date(taskDateObj.getTime() - 864e5)),
								}) }
								onFocusChange={ (value) => setIsFocused(value) }
							/>
						) : (
							<IconButton
								label="Move to tomorrow"
								icon="arrowRight"
								onClick={ () => dispatch({
									type: 'moveToDate',
									id: id,
									order: order,
									from: date,
									to: getYearMonthDayString(new Date(taskDateObj.getTime() + 864e5)),
								}) }
								onFocusChange={ (value) => setIsFocused(value) }
							/>
						) }
					</>
				) }
			</div>
		</div>
	);
};

export default Task;
