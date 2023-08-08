// import React, { useState, useEffect, useCallback } from 'react';
// import { useSnackbar } from 'notistack';

// import { Box, CircularProgress } from '@mui/material';
// import { ICompany, CompanyHeadCells } from 'coverme-shared';

// import EnhancedTable from 'components/tables/EnhancedTable/EnhancedTable';
// import CreateCompanyForm from 'components/forms/company/CreateCompanyForm';
// import DeleteConfirmation from 'components/dialogs/DeleteConfirmation';

// import FormDialog from 'components/dialogs/FormDialog';
// import { getAddAction, getDeleteAction } from 'utils/react/table-actions-helper';
// import axios from 'utils/axios-intance';

// const CompaniesView: React.FC = () => {
//     const [openAddCompany, setOpenAddCompany] = useState<boolean>(false);
//     const [openDeleteCompany, setOpenDeleteCompany] = useState<boolean>(false);
//     const [isLoadingCompanies, setIsLoadingCompanies] = useState<boolean>(false);
//     const [isLoadingDeleteCompanies, setIsLoadingDeleteCompanies] = useState<boolean>(false);
//     const [deleteMessage, setDeleteMessage] = useState<string>('');
//     const [companies, setCompanies] = useState<ICompany[]>([]);
//     const [selected, setSelected] = useState<any | undefined>(undefined);

//     const { enqueueSnackbar } = useSnackbar();

//     const handleSelectCompany = (company: any | undefined) => {
//         if (selected === company) {
//             setSelected(undefined);
//         } else {
//             setSelected(company);
//         }
//     };

//     const handleAddCompany = () => {
//         setOpenAddCompany(true);
//     };

//     const handleCloseAddCompany = () => {
//         setOpenAddCompany(false);
//     };

//     const handleCompleteAddCompany = (success: boolean, company?: ICompany) => {
//         if (success && company) {
//             const newCompanies = [...companies, company];
//             setCompanies(newCompanies);
//         }
//         handleCloseAddCompany();
//     };

//     const handleOpenDeleteCompany = (selectedCompany: any) => {
//         setDeleteMessage(`Are you sure you want to delete ${selectedCompany}?`);
//         setOpenDeleteCompany(true);
//     };

//     const handleCloseDeleteCompany = () => {
//         setOpenDeleteCompany(false);
//     };

//     const handleConfirmDeleteCompany = () => {
//         setIsLoadingDeleteCompanies(true);
//         axios
//             .get(`${process.env.REACT_APP_SERVER_API}/company/delete/${selected}`)
//             .then(() => {
//                 enqueueSnackbar('User successfully deleted', { variant: 'success' });
//                 const newCompanies = companies.filter((company) => company.name !== selected);
//                 setCompanies(newCompanies);
//                 setSelected(undefined);
//             })
//             .catch((err) => {
//                 console.error(err);
//                 enqueueSnackbar('Error trying to delete company, please try again', {
//                     variant: 'error',
//                 });
//             })
//             .finally(() => {
//                 setIsLoadingDeleteCompanies(false);
//                 handleCloseDeleteCompany();
//             });
//     };

//     const handleGetCompanies = useCallback(() => {
//         setIsLoadingCompanies(true);
//         axios
//             .get(`${process.env.REACT_APP_SERVER_API}/company/info`)
//             .then((result) => {
//                 setCompanies(result.data);
//             })
//             .catch((err) => {
//                 console.error(err);
//             })
//             .finally(() => {
//                 setIsLoadingCompanies(false);
//             });
//     }, []);

//     useEffect(() => {
//         handleGetCompanies();
//     }, [handleGetCompanies]);

//     return (
//         <>
//             {isLoadingCompanies ? (
//                 <Box
//                     sx={{
//                         display: 'flex',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         height: '100vh',
//                     }}
//                 >
//                     <CircularProgress size={100} />
//                 </Box>
//             ) : (
//                 <Box>
//                     <EnhancedTable
//                         title="Company List"
//                         data={companies}
//                         headerCells={CompanyHeadCells}
//                         id="name"
//                         selected={selected}
//                         onSelect={handleSelectCompany}
//                         unSelectedActions={getAddAction('Company', handleAddCompany)}
//                         selectedActions={getDeleteAction('Company', handleOpenDeleteCompany)}
//                     />
//                     <FormDialog open={openAddCompany} onClose={handleCloseAddCompany}>
//                         <CreateCompanyForm onFinish={handleCompleteAddCompany} />
//                     </FormDialog>
//                     <DeleteConfirmation
//                         open={openDeleteCompany}
//                         message={deleteMessage}
//                         isLoading={isLoadingDeleteCompanies}
//                         onClose={handleCloseDeleteCompany}
//                         onConfirm={handleConfirmDeleteCompany}
//                     />
//                 </Box>
//             )}
//         </>
//     );
// };

// export default CompaniesView;

export default {};
