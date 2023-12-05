import { CustomModal, Typography, Button } from "../shared";
import ClearIcon from "@mui/icons-material/Clear";
import Delete from "@mui/icons-material/Delete";


export const SimpleDeleteModal = ({ states }) => {
    const {
        open,
        setOpen,
        errorMsg,
        setErrorMsg,
        headTitle,
        deleteName,
        loading,
        deleteMethod,
    } = states;
    return (
        <CustomModal
            open={open}
            close={() => {
                setOpen(!open);
                setErrorMsg && setErrorMsg("");
            }}
            width={window.innerWidth * 0.4}>
            <div>
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row justify-between items-center text-center">
                        <div className="cursor-pointer">
                            <Delete className="mx-3 mb-1" color="danger" fontSize="small" />
                        </div>
                        {headTitle ? headTitle : ""}
                    </div>
                    <div
                        className="pointer mx-3"
                        onClick={() => {
                            setOpen(!open);
                            setErrorMsg && setErrorMsg("");
                        }}>
                        <ClearIcon color="secondary" fontSize="small" />
                    </div>
                </div>
                <div className="my-3">
                    <Typography
                        className="flex flex-row items-center"
                        variant="body1"
                        fontSize={15}
                        marginBottom={1}
                        marginTop={3}
                        marginLeft={3}
                        fontWeight="light">
                        {deleteName ? (
                            <>
                                <span>Are you sure you want to delete "</span>
                                <span className="fw-bold">{deleteName}</span>
                                <span className="fw-light">"?</span>
                            </>
                        ) : (
                            <span>Are you sure you want to delete the item?</span>
                        )}
                    </Typography>
                    <Typography className="ml-6 text-sm text-danger">
                        {errorMsg ? errorMsg : ""}
                    </Typography>
                    <div className="flex flex-row justify-end items-center mx-3 mt-4 mb-2">
                        <Button
                            className="capitalize mr-[10px]"
                            component="span"
                            variant="outlined"
                            color="secondary"
                            disabled={loading}
                            onClick={() => {
                                setOpen(!open);
                                setErrorMsg && setErrorMsg("");
                            }}>
                            Cancel
                        </Button>
                        <Button
                            component="span"
                            className="capitalize text-white"
                            color="danger"
                            variant="contained"
                            disabled={loading}
                            loading={loading}
                            onClick={deleteMethod && deleteMethod}>
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </CustomModal>
    );
};
