import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useUser } from '../context/UserContext';
import { useTradeModal } from '../context/TradeModalContext';
import { usePrice } from "../context/PriceContext";
import { useColorMode } from '../context/ColorModeContext';
import { handleCamelCase, calcMaxQty } from '../helper/ModalFunctions';
import NumberInputBasic from './NumberInput';
import { useQuery, useMutation, useQueryClient } from "react-query";
import useUserDataReactQuery from '../hooks/useUserDataReactQuery';
import LoadingButton from '@mui/lab/LoadingButton';
import toast, { Toaster } from "react-hot-toast";

const style = {
    position: 'absolute',
    minWidth: "320px",
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '1px solid background.paper',
    boxShadow: 24,
    p: 4,
  };


function TransactionConfirmModal() {
    const { userAuthData, setUserAuthData } = useUser();
    const { checked } = useColorMode();
    const { openModal, setOpenModal, investmentType, transactionType, qty } = useTradeModal();
    const { pricesData } = usePrice();
    const { getUserProfile, updateUserProfile } = useUserDataReactQuery();
    const queryClient = useQueryClient();

    const handleClose = () => setOpenModal(false);

    const {
        isLoading,
        isError,
        error,
        data
    } = useQuery(["userProfile", userAuthData.username], () => getUserProfile(userAuthData.username), {
        enabled: !!userAuthData.username,
        refetchOnWindowFocus: false,
        staleTime: 10 * 60 * 1000,
        cacheTime: 15 * 60 * 1000,
        select: (data) => {return { creditBalance: data.creditBalance, investments: data.investments}}
    });

    const updateUserProfileMutation = useMutation(updateUserProfile, {
        onSuccess: () => {
            toast.success("Transaction success!")
            // Invalidates cache and refetch
            queryClient.invalidateQueries("userProfile");
        },
        onError: (error, variables, context) => {
            toast.error("Transaction error!")
        },
    })

    const formattedTransactionType = transactionType.slice(0, 1) + transactionType.slice(1).toLowerCase();
    const isBuying = Boolean(transactionType.toLowerCase() === "buy");
    const camelCaseInvType = handleCamelCase(investmentType);
    const priceOfInvType = pricesData ? pricesData[handleCamelCase(investmentType)] : <span>...</span>;      
    const totalPrice = priceOfInvType * qty;

    const patchData = {
        creditBalance: (isBuying ? data?.creditBalance - totalPrice : data?.creditBalance + totalPrice),
        investments: { [camelCaseInvType]: (isBuying ? (data?.investments[camelCaseInvType] + qty) : (data?.investments[camelCaseInvType] - qty)) },
    }


  return (
    <div>
        <Modal
            open={openModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                {pricesData &&
                    (
                    <Box sx={{ color: checked ? "whitesmoke" : "black" }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: "center" }}>
                        - {formattedTransactionType} {investmentType} -
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <span style={{ fontWeight: "700", marginRight: "8px" }}>Price of 1 Qty:</span> {priceOfInvType} credit.
                        </Typography>
                        <div style={{ marginTop: "14px" }}>
                            <span style={{ fontWeight: "700" }}>QTY:</span> 
                            <span style={{ display: "inline-grid" }}>{!isLoading && pricesData 
                                ? <NumberInputBasic 
                                    maxQty={calcMaxQty(transactionType, data?.creditBalance, priceOfInvType, data?.investments[camelCaseInvType])} />
                                : <p>Loading...</p>}
                            </span>
                        </div>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <span style={{ fontWeight: "700" }}>Total:</span> {totalPrice}
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mb: 3, mt: 2, textAlign: "center" }}>
                            Are you sure ?
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "space-between"}}>
                            {updateUserProfileMutation.isLoading 
                                ? <LoadingButton loading variant="outlined">Confirm</LoadingButton>
                                : <Button variant='contained' disabled={qty === 0} onClick={() => updateUserProfileMutation.mutate({ username: userAuthData.username, patchData })}>Confirm</Button>
                            }
                            
                            <Button variant='contained' onClick={() => setOpenModal(false)}>Cancel</Button>
                        </Box>
                    </Box>
                    )
                }
                
            </Box>
        </Modal>
        <Toaster />
    </div>
  )
}

export default TransactionConfirmModal
