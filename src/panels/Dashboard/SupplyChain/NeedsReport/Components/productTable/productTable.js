import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { TextField } from '../../../../../../shared';
import './productTable.css';
import { Edit } from '@mui/icons-material';
import TablePagination from '@mui/material/TablePagination';

const ProductTable = ({ tableHead, tableRow }) => {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [inputData, setInputData] = useState(tableRow);

    useEffect(() => {
        setInputData(tableRow);
    }, [tableRow]);

    const handleInputChange = (index, name, value) => {
        inputData[index][name] = value;
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const tableHeadings = tableHead?.map((head, index) => {
        return (
            <th 
            scope="col" 
            key={index} 
            className="py-3 px-3 text-left text-xs font-semibold [&>*:nth-child(even)]:mt-1 sm:pl-6 whitespace-nowrap !min-w-[110px]">
                {head.title}
            </th>
        )
    })

    const tableRows = tableRow?.map((row, rowIndex) => {

        return (
            <>
                <tr key={`${rowIndex}`} className=''>
                    {tableHead?.map((head, cellIndex) => {
                        return (
                            <td key={`${cellIndex}`} className="whitespace-nowrap px-3 py-[10px] text-sm font-semibold table-row-h">
                                {row[head.name] !== undefined ? (
                                    <div className='flex'>
                                    {head.name === "name" ? (
                                            <div
                                                className="d-flex flex-row align-items-center cursor-pointer"
                                            onClick={() => {
                                                navigate("/inventory/edit-product/${id}", {
                                                    state: { product: row },
                                                })
                                            }}
                                            >
                                                <Edit className={`text-[20px] mr-2 text-secondaryColor`} />
                                            </div>
                                        ) : null
                                    }
                                    {row[head.name]}
                                    </div>
                                ) : (
                                    <>
                                        <TextField
                                            label={head.name}
                                            fullWidth={true}
                                            size="small"
                                            className="bg-white"
                                            value={row[head.name]}
                                            name={head.name}
                                            onChange={(e) => handleInputChange(rowIndex, head.name, e.target.value)}
                                            required
                                            placeholderSize="14px"
                                        />
                                    </>
                                )}
                            </td>
                        )
                    })}
                </tr>
            </>
        )
    })


    return (
        <>
        <div className="my-2 align-middle ml-3 overflow-x-auto mr-3 rounded-t-[10px]">
            <div className="h-[250px]">
                <table className="divide-y divide-gray-300 w-full">
                    <thead className="bg-white">
                        <tr className="[&>*:nth-child(1)]:min-w-[300px] table-head">
                            {tableHeadings}
                        </tr>
                    </thead>
                    <tbody className="table-body-h [&>*:nth-child(even)]:bg-lightGray">
                            {tableRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                    </tbody>
                </table>
            </div>
        </div>
            <div className="w-full">
                <TablePagination
                    sx={{
                        '& .MuiToolbar-root.MuiToolbar-gutters.MuiToolbar-regular': {
                            display: 'flex',
                            justifyContent: "flex-start",
                            margin: 0,
                            padding: 0,
                            paddingLeft: "13px",
                            borderTop: "1px solid #e6e6e6"
                        },
                        '& .MuiToolbar-root.MuiToolbar-gutters.MuiToolbar-regular > div:first-of-type': {
                            display: 'none',
                        },
                        '& .MuiToolbar-root.MuiToolbar-gutters.MuiToolbar-regular > div:nth-child(3)': {
                            fontSize: "15px",
                            marginLeft: "15px"
                        },
                        '& .MuiToolbar-root.MuiToolbar-gutters.MuiToolbar-regular > p:nth-child(2)': {
                            fontSize: "12px",
                        },
                        '& .MuiToolbar-root.MuiToolbar-gutters.MuiToolbar-regular > p:nth-child(4)': {
                            marginLeft: 'auto',
                            fontSize: "12px",
                        },
                        '& .MuiTablePagination-actions button > svg': {
                            fontSize: '20px',
                        },
                    }}
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={tableRow.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
        </>
    )
}

export default ProductTable