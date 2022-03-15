import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';

import companyHeadCells from 'models/HeaderCells/CompanyHeadCells';
import { Box, CircularProgress } from '@mui/material';
import { ICompany } from 'models/Company';

import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';
import CreateCompanyForm from 'components/forms/CreateCompanyForm';
import DeleteConfirmation from 'components/dialogs/DeleteConfirmation';

import axios from 'utils/axios-intance';
import FormDialog from 'components/dialogs/FormDialog';
import { ISelectedAction, IUnselectedAction } from 'models/TableInfo';

const Companies: React.FC = () => {
    const [openAddCompany, setOpenAddCompany] = useState<boolean>(false);
    const [openDeleteCompany, setOpenDeleteCompany] = useState<boolean>(false);
    const [isLoadingCompanies, setIsLoadingCompanies] = useState<boolean>(false);
    const [isLoadingDeleteCompanies, setIsLoadingDeleteCompanies] = useState<boolean>(false);
    const [deleteMessage, setDeleteMessage] = useState<string>('');
    const [companies, setCompanies] = useState<ICompany[]>([]);
    const [selected, setSelected] = useState<any | undefined>(undefined);

    const { enqueueSnackbar } = useSnackbar();

    const handleSelectCompany = (company: any | undefined) => {
        if (selected === company) {
            setSelected(undefined);
        } else {
            setSelected(company);
        }
    };

    const handleAddCompany = () => {
        setOpenAddCompany(true);
    };

    const handleCloseAddCompany = () => {
        setOpenAddCompany(false);
    };

    const handleCompleteAddCompany = (success: boolean, company?: ICompany) => {
        if (success && company) {
            const newCompanies = [...companies, company];
            setCompanies(newCompanies);
        }
        handleCloseAddCompany();
    };

    const handleOpenDeleteCompany = (selectedCompany: any) => {
        setDeleteMessage(`Are you sure you want to delete ${selectedCompany}?`);
        setOpenDeleteCompany(true);
    };

    const handleCloseDeleteCompany = () => {
        setOpenDeleteCompany(false);
    };

    const handleConfirmDeleteCompany = () => {
        setIsLoadingDeleteCompanies(true);
        axios
            .get(`${process.env.REACT_APP_SERVER_API}/company/delete/${selected}`)
            .then(() => {
                enqueueSnackbar('User successfully deleted', { variant: 'success' });
                const newCompanies = companies.filter((company) => company.name !== selected);
                setCompanies(newCompanies);
                setSelected(undefined);
            })
            .catch((err) => {
                console.error(err);
                enqueueSnackbar('Error trying to delete company, please try again', {
                    variant: 'error',
                });
            })
            .finally(() => {
                setIsLoadingDeleteCompanies(false);
                handleCloseDeleteCompany();
            });
    };

    const handleGetCompanies = useCallback(() => {
        setIsLoadingCompanies(true);
        axios
            .get(`${process.env.REACT_APP_SERVER_API}/company/info`)
            .then((result) => {
                setCompanies(result.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setIsLoadingCompanies(false);
            });
    }, []);

    useEffect(() => {
        handleGetCompanies();
    }, [handleGetCompanies]);

    const unSelectedTableActions: IUnselectedAction[] = [
        {
            tooltipTitle: 'Add Staff',
            permissionLevel: 2,
            icon: <AddCircleIcon color="primary" fontSize="large" />,
            onClick: handleAddStaff,
        },
    ];

    const selectedTableActions: ISelectedAction[] = [
        {
            tooltipTitle: 'Delete Staff',
            permissionLevel: 2,
            icon: <DeleteIcon color="primary" fontSize="large" />,
            onClick: handleOpenDeleteStaff,
        },
    ];

    return (
        <>
            {isLoadingCompanies ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                    }}
                >
                    <CircularProgress size={100} />
                </Box>
            ) : (
                <Box>
                    <EnhancedTable
                        title="Company List"
                        data={companies}
                        headerCells={companyHeadCells}
                        id="name"
                        selected={selected}
                        onSelect={handleSelectCompany}
                        onAdd={handleAddCompany}
                        onDelete={handleOpenDeleteCompany}
                    />
                    <FormDialog open={openAddCompany} onClose={handleCloseAddCompany}>
                        <CreateCompanyForm onFinish={handleCompleteAddCompany} />
                    </FormDialog>
                    <DeleteConfirmation
                        open={openDeleteCompany}
                        message={deleteMessage}
                        isLoading={isLoadingDeleteCompanies}
                        onClose={handleCloseDeleteCompany}
                        onConfirm={handleConfirmDeleteCompany}
                    />
                </Box>
            )}
        </>
    );
};

export default Companies;
