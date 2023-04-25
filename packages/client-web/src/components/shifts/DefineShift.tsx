import React, { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';
import FormDialog from 'components/dialogs/FormDialog';
import CreateShiftForm from 'components/forms/CreateShiftForm';
import DeleteConfirmation from 'components/dialogs/DeleteConfirmation';
import { getAddAction, getEditDeleteAction } from 'utils/react/table-actions-helper';
import api from 'utils/api';

import { IShiftTemplate, IShiftTemplateDisplay, ShiftHeadCells } from 'coverme-shared';

interface IDefineShiftProps {
	shiftTemplates: IShiftTemplateDisplay[];
	shifts: IShiftTemplate[];
	onEdit: (shiftTemplate: IShiftTemplate) => void;
	onAdd: (shiftTemplate: IShiftTemplate) => void;
	onDelete: (shiftTemplates: IShiftTemplateDisplay[]) => void;
}

const DefineShift: React.FC<IDefineShiftProps> = ({
	shiftTemplates,
	onAdd,
	onDelete,
	shifts,
	onEdit,
}) => {
	const [openAddShift, setOpenAddShift] = useState<boolean>(false);
	const [openDeleteShift, setOpenDeleteShift] = useState<boolean>(false);
	const [openEditShift, setOpenEditShift] = useState<boolean>(false);
	const [deleteMessage, setDeleteMessage] = useState<string>('');
	const [isLoadingDeleteShift, setIsLoadingDeleteShift] = useState<boolean>(false);
	const [selected, setSelected] = useState<any | undefined>(undefined);

	const { enqueueSnackbar } = useSnackbar();

	// TO DO: REFACTOR OUTSIDE COMP
	const getShiftName = (id: string) => {
		const shiftFound = shiftTemplates.find((shiftTemplate) => shiftTemplate.id === id);

		if (shiftFound) {
			return shiftFound.name;
		} else {
			return id;
		}
	};

	const handleAddShift = () => {
		setOpenAddShift(true);
	};

	const handleOpenDeleteShift = (selectedShift: any) => {
		setDeleteMessage(`Are you sure you want to delete ${getShiftName(selectedShift)}?`);
		setOpenDeleteShift(true);
	};

	const handleOpenEditShift = () => {
		setOpenEditShift(true);
	};

	const handleCloseEditShift = () => {
		setOpenEditShift(false);
	};

	const handleCloseAddShift = () => {
		setOpenAddShift(false);
	};

	const handleCloseDeleteShift = () => {
		setOpenDeleteShift(false);
	};

	const handleSelectShift = (shift: any | undefined) => {
		if (selected === shift) {
			setSelected(undefined);
		} else {
			setSelected(shift);
		}
	};

	const handleConfirmDeleteShift = () => {
		setIsLoadingDeleteShift(true);
		api.get(`shift-templates/${selected}/delete`)
			.then(() => {
				enqueueSnackbar('Shift template successfully deleted', { variant: 'success' });
				const newShiftDefs = shiftTemplates.filter(
					(shiftTemplate) => shiftTemplate.id !== selected
				);

				onDelete(newShiftDefs);
				setSelected(undefined);
			})
			.catch((err) => {
				enqueueSnackbar('Error trying to delete shift template, please try again', {
					variant: 'error',
				});
			})
			.finally(() => {
				setOpenDeleteShift(false);
				setIsLoadingDeleteShift(false);
			});
	};

	const handleConfirmAdd = (shiftTemplate: IShiftTemplate) => {
		handleCloseAddShift();

		onAdd(shiftTemplate);
	};

	return (
		<>
			<EnhancedTable
				data={shiftTemplates}
				headerCells={ShiftHeadCells}
				id="id"
				selected={selected}
				onSelect={handleSelectShift}
				unSelectedActions={getAddAction('Shift', handleAddShift)}
				selectedActions={getEditDeleteAction(
					'Shift',
					handleOpenDeleteShift,
					handleOpenEditShift
				)}
			/>
			<FormDialog open={openAddShift} onClose={handleCloseAddShift}>
				<CreateShiftForm
					onAddComplete={handleConfirmAdd}
					editMode={false}
					selectedTemplate={selected}
					selectedTimes={selected}
					onFinish={() => {
						handleCloseAddShift();
					}}
				/>
			</FormDialog>
			<FormDialog open={openEditShift} onClose={handleCloseEditShift}>
				<CreateShiftForm
					editMode={true}
					onAddComplete={handleConfirmAdd}
					selectedTemplate={shiftTemplates.find(
						(shiftTemplate) => shiftTemplate.id === selected
					)}
					onFinish={(shiftTemplate: IShiftTemplate) => {
						handleCloseEditShift();
						onEdit(shiftTemplate);
					}}
					selectedTimes={shifts.find((shift) => shift.id === selected)}
				/>
			</FormDialog>
			<DeleteConfirmation
				open={openDeleteShift}
				message={deleteMessage}
				isLoading={isLoadingDeleteShift}
				onClose={handleCloseDeleteShift}
				onConfirm={handleConfirmDeleteShift}
			/>
		</>
	);
};

export default DefineShift;
