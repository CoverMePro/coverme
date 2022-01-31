import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useTypedSelector } from 'hooks/use-typed-selector';

import companyHeadCells from 'models/HeaderCells/CompanyHeadCells';
import { Box, Dialog, CircularProgress } from '@mui/material';
import { ICompany } from 'models/Company';

import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';

import axios from 'utils/axios-intance';

const Companies: React.FC = () => {
    const [openAddCompany, setOpenAddCompany] = useState<boolean>(false);
    const [openDeleteCompany, setOpenDeleteCompany] = useState<boolean>(false);
    const [isLoadingCompanies, setIsLoadingCompanies] = useState<boolean>(false);
    const [deleteMessage, setDeleteMessage] = useState<string>('');
    const [companies, setCompanies] = useState<ICompany[]>([]);
    const [selected, setSelected] = useState<any | undefined>(undefined);

    useEffect(() => {
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

    const handleOpenDeleteCompany = (selectedStaff: any) => {
        setDeleteMessage(`Are you sure you want to delete ${selectedStaff}?`);
        setOpenDeleteCompany(true);
    };

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
                </Box>
            )}
        </>
    );
};

export default Companies;
