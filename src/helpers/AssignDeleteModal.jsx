import Delete from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import { Alert, Button, CustomModal, Typography } from "../shared";

export const AssignDeleteModal = ({
    open,
    headTitle,
    onClose,
    warningMsg,
    onDelete,
    loading,
    children,
    errorMsg,
    confirmationPrompt,
}) => {
    return (
        <CustomModal
            open={open}
            close={onClose}
            width={window.innerWidth * 0.4}>
            <div>
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row justify-between items-center text-center">
                        <div className="pointer">
                            <Delete
                                className="mx-3 mb-1"
                                color="danger"
                                fontSize="small"
                            />
                        </div>
                        <b>{headTitle ? headTitle : ""}</b>
                    </div>
                    <div className="cursor-pointer mx-3" onClick={onClose}>
                        <ClearIcon color="secondary" fontSize="small" />
                    </div>
                </div>
                {warningMsg ? (
                    <div className="my-3 mx-4">
                        <Alert severity="error" icon={true}>
                            <Typography
                                variant="body1"
                                className="text-[15px] font-light text-danger">
                                {warningMsg}
                            </Typography>
                        </Alert>
                    </div>
                ) : null}
                {confirmationPrompt ? (
                    <Typography
                        className="d-flex flex-row align-items-center"
                        variant="body1"
                        fontSize={15}
                        marginBottom={1}
                        marginTop={3}
                        marginLeft={3}
                        fontWeight="light"
                        >
                        {confirmationPrompt}
                    </Typography>
                ) : null}
                {children}
                {errorMsg ? (
                    <Typography className="text-danger text-sm -mb-4 ml-7 ">
                        {errorMsg}
                    </Typography>
                ) : null}
                <div className="flex flex-row justify-end items-center m-3">
                    <Button
                        component="span"
                        color="secondary"
                        className="capitalize mr-[10px]"
                        variant="outlined"
                        loading={loading}
                        disabled={loading}
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        component="span"
                        color="danger"
                        className="capitalize text-white"
                        variant="contained"
                        loading={loading}
                        disabled={loading}
                        onClick={onDelete}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </CustomModal>
    );
};