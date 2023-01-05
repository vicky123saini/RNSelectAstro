import React from 'react';
import * as env from "../env";
import * as Auth from './Auth';
import DeviceInfo from 'react-native-device-info';

var jwtDecode = require('jwt-decode');

export const LoginByOtpService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Account/LoginByOtp`, 
        method:"POST",
        body:body,
        IsDeviceId:true
    });
}

export const LoginByOneClickService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Account/LoginByOneClick`, 
        method:"POST",
        body:body,
        IsDeviceId:true
    });
}

export const LoginBySocialService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Account/LoginBySocial`, 
        method:"POST",
        body:body,
        IsDeviceId:true
    });
}

export const RegistrationService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Account/Registration`, 
        method:"POST",
        body:body,
        IsDeviceId:true
    });
}

export const UpdateUserDetailsService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Account/UpdateUserDetails`, 
        method:"POST",
        body:body
    });
}

export const ConfirmProfileDetailsService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Account/ConfirmProfileDetails`, 
        method:"POST",
        body:body
    });
}

export const SkypeUpdateUserDetailsService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Account/SkypeUpdateUserDetails`, 
        method:"POST",
        body:body
    });
}
export const ValidateOTPService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Account/ValidateOTP`, 
        method:"POST",
        body:body
    });
}

export const OTPResendService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Account/OTPResend`, 
        method:"POST",
        body:body
    });
}

export const GetProfileService = async (Id) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Account/GetProfile/${Id}`, 
        method:"GET",
        body:{}
    });
}

export const TmpAstroLoginService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Account/TmpAstroLogin`, 
        method:"POST",
        body:body
    });
}

export const GetSkillsService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Master/GetSkills`, 
        method:"GET",
        body:{}
    });
}

export const GetGemstoneService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Master/GetGemstone`, 
        method:"GET",
        body:{}
    });
}

export const HomePageBannersService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Master/HomePageBanners`, 
        method:"GET",
        body:{}
    });
}
export const GetBannersService = async (BannerType) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Master/GetBanners/?BannerType=${BannerType}`, 
        method:"GET",
        body:{}
    });
}
export const GetVideosService = async (Type) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Master/GetVideos/${Type}`, 
        method:"GET",
        body:{}
    });
}

export const GetAstrologerForMobileHomeService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Astrologer/GetForMobileHome`, 
        method:"GET",
        body:{}
    });
}

export const GetAstrologerForMobileHomeNewService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Astrologer/GetForMobileHome`, //v2
        method:"GET",
        body:{}
    });
}

export const SearchService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Astrologer/Search`, 
        method:"POST",
        body:body
    });
}

export const SearchServiceTmp = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/web/Astrologer/Search`, 
        method:"POST",
        body:body
    });
}

export const GetAstrologerDetailsByIdService = async (Id) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Astrologer/GetDetailsById/${Id}`, 
        method:"GET",
        body:{}
    });
}

export const InitCallService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Exotel/InitCall`, 
        method:"POST",
        body:body
    });
}

export const GetCallStatusByIdService = async (Id) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Exotel/GetCallStatusById/${Id}`, 
        method:"GET",
        body:{}
    });
}

export const GetMyHoroscopeFullService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Horoscope/GetMyHoroscopeFull`, 
        method:"GET",
        body:{}
    });
}

export const GetSocialMediaService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/SocialMedia/GetForMobile`, 
        method:"GET",
        body:{}
    });
}

export const GetExpertiesService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Master/GetExperties`, 
        method:"GET",
        body:{}
    });
}

export const GetEnduserProfileService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/EndUser/GetMyProfile`, 
        method:"GET",
        body:{}
    });
}

export const GetHoroscopeFullByIdService = async (Id) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Horoscope/GetHoroscopeFull/${Id}`, 
        method:"GET",
        body:{}
    });
}

export const GetAllZodiacSignService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Horoscope/GetAllZodiacSign`, 
        method:"GET",
        body:{}
    });
}

export const GetCompatibilityScoreService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Horoscope/GetCompatibilityScore`, 
        method:"POST",
        body:body
    });
}
export const GetMatchmakingLocationSuggestionService = async (keywords) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Matchmaking/GetLocationSuggestion/${keywords}`, 
        method:"GET",
        body:{}
    });
}

export const GetUserHistoryService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Horoscope/getUserHistory`, 
        method:"GET",
        body:{}
    });
}

export const GetMyAnnualHoroscopeService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Horoscope/GetMyAnnualHoroscope`, 
        method:"GET",
        body:{}
    });
}

//kundali
export const GetkundaliBasicInfoService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Kundali/GetBasicInfo`, 
        method:"POST",
        body:body
    });
}
export const GetkundaliPlaneteryDetailsService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Kundali/GetPlaneteryDetails`, 
        method:"POST",
        body:body
    });
}
export const GetkundaliDivisionalChartsbyDivisonService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Kundali/GetDivisionalChartsbyDivison`, 
        method:"POST",
        body:body
    });
}
export const GetkundaliMahaDshaService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Kundali/GetMahaDsha`, 
        method:"POST",
        body:body
    });
}
export const GetKundaliLocationSuggestionService = async (keywords) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Kundali/GetLocationSuggestion/${keywords}`, 
        method:"GET",
        body:{}
    });
}
export const DownloadKundaliHoroscopeCreateTransactionService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Kundali/DownloadHoroscopeCreateTransaction`, 
        method:"POST",
        body:body
    });
}

export const DownloadHoroscopeCreateTransactionService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Kundali/DownloadHoroscopeCreateTransaction`, //v2
        method:"POST",
        body:body
    });
}
export const DownloadHoroscopeUpdateTransactionService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Kundali/DownloadHoroscopeUpdateTransaction`, //v2
        method:"POST",
        body:body
    });
}

//panchang
export const GetPanchangService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Panchang/GetPanchang`, 
        method:"POST",
        body:body
    });
}
export const GetPanchangSunriseService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Panchang/GetPanchangSunrise`, 
        method:"POST",
        body:body
    });
}
export const GetPanchangSunsetService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Panchang/GetPanchangSunset`, 
        method:"POST",
        body:body
    });
}


export const GetBalanceService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Wallet/GetBalance`, 
        method:"GET",
        body:{}
    });
}

export const WalletRechargPlansService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Wallet/RechargPlans`, 
        method:"GET",
        body:{}
    });
}

export const WalletCreateTransactionService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Wallet/CreateTransaction`, 
        method:"POST",
        body:body
    });
}

export const WalletCompleteTransactionService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Wallet/CompleteTransaction`, 
        method:"POST",
        body:body
    });
}

export const GetBlogsCategorysService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Master/BlogsCategorys`, 
        method:"GET",
        body:{}
    });
}

export const GetBlogsByCategoryService = async (Id) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Master/GetBlogsByCategory/${Id}`, 
        method:"GET",
        body:{}
    });
}

export const GetBlogByIdService = async (Id) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Master/GetBlogById/${Id}`, 
        method:"GET",
        body:{}
    });
}

export const GetBlogsForHomeService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Master/GetBlogsForHome`, 
        method:"GET",
        body:{}
    });
}

export const GetAgeGroupService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Master/GetAge`, 
        method:"GET",
        body:{}
    });
}

export const GetProfessionService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Master/GetProfession`, 
        method:"GET",
        body:{}
    });
}

export const GetPujaService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Master/GetPuja`, 
        method:"GET",
        body:{}
    });
}

export const GetSizeOfGemstoneService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Master/GetSize_Of_Gemstone`, 
        method:"GET",
        body:{}
    });
}

export const GetWhenWeCallBackService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Master/GetWhen_We_Call_Back`, 
        method:"GET",
        body:{}
    });
}

export const AstrologerFeedbackService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Astrologer/Astrologer_Feedback`, 
        method:"POST",
        body:body
    });
}


export const GetServiceStatesService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Astrologer/GetServiceStates`, 
        method:"GET",
        body:{}
    });
}

export const UpdateServiceStatesService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Astrologer/UpdateServiceStates`, 
        method:"POST",
        body:body
    });
}

export const GetUpcommingCallerDetailsService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Astrologer/GetUpcommingCallerDetails`, 
        method:"GET",
        body:{}
    });
}

export const GetCallLogsService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Astrologer/CallLogs`, 
        method:"GET",
        body:{}
    });
}

export const GetAstroReviewAndRatingsService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Astrologer/ReviewAndRatings`, 
        method:"GET",
        body:{}
    });
}

export const AstroFeedbackService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Astrologer/Feedback`, 
        method:"POST",
        body:body
    });
}

export const GetExpertProfileService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Astrologer/GetExpertProfile`, 
        method:"GET",
        body:{}
    });
}

export const GetAppSettingByKetService = async (Id) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Account/GetAppSettingByKet/${Id}`, 
        method:"GET",
        body:{}
    });
}

export const GetLocationSuggestionService = async (keywords) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Account/GetLocationSuggestion/${keywords}`, 
        method:"GET",
        body:{}
    });
}

export const UpdateMobileNoService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Account/UpdateMobileNo`, 
        method:"POST",
        body:body
    });
}

export const SetBookmarkService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Astrologer/SetBookmark`, 
        method:"POST",
        body:body
    });
}

export const SetNotifyMeService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Astrologer/SetNotifyMe`, 
        method:"POST",
        body:body
    });
}

export const RechargeHistoryService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/EndUser/RechargeHistory`, 
        method:"GET",
        body:{}
    });
}

export const CallHistoryService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/EndUser/CallHistory`, 
        method:"GET",
        body:{}
    });
}

export const WalletHistoryService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/EndUser/WalletHistory`, 
        method:"GET",
        body:{}
    });
}

export const GetSearchFiltersService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Astrologer/GetSearchFilters`, 
        method:"GET",
        body:{}
    });
}

export const SetReviewAndRatingsLikeService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Astrologer/ReviewAndRatings/Like`, 
        method:"POST",
        body:body
    });
}

export const SetReviewAndRatingsReportService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Astrologer/ReviewAndRatings/Report`, 
        method:"POST",
        body:body
    });
}

export const SetAstrologerReportService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Astrologer/Report`, 
        method:"POST",
        body:body
    });
}

export const GetOffersService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Wallet/GetOffers`, 
        method:"GET",
        body:{}
    });
}

export const GetRecommendedOffersService = async (planId) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Wallet/GetRecommendedOffers/${planId}`, 
        method:"GET",
        body:{}
    });
}

export const ContactusService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Contactus`, 
        method:"POST",
        body:body
    });
}

export const GetFeedbackPendingStatusService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/EndUser/GetFeedbackPendingStatus`, 
        method:"GET",
        body:{}
    });
}

export const FeedbackService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/EndUser/Feedback`, 
        method:"POST",
        body:body
    });
}

export const GetFeedbackDetailsService = async (Id) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/EndUser/GetFeedbackDetails/${Id}`, 
        method:"GET",
        body:{}
    });
}
 

export const UploadUserProfileImageService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Fileupload/User/ProfileImage`, 
        method:"POST",
        body:body,
        isFormData:true
    });
}


/********Chat Services************/
export const InitChatService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Chat/InitChat`, 
        method:"POST",
        body:body
    });
}

export const UpdateChatStatusService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Chat/UpdateChatStatus`, 
        method:"POST",
        body:body
    });
}

export const GetChatCurrentStatusService = async (SessionId) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Chat/GetCurrentStatus/${SessionId}`, 
        method:"GET",
        body:{}
    });
}

export const ChatPushMessageService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Chat/PushMessage`, 
        method:"POST",
        body:body
    });
}

export const GetChatDetailsService = async (Id) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Chat/GetChatDetails/${Id}`, //v2
        method:"GET",
        body:{}
    });
}

export const ClearChatHistoryService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Chat/ClearChatHistory`, 
        method:"POST",
        body:body
    });
}
//video call
export const InitVideoCallService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/VideoCall/InitVideoCall`, 
        method:"POST",
        body:body
    });
}

export const UpdateVideoCallStatusService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/VideoCall/UpdateVideoCallStatus`, 
        method:"POST",
        body:body
    });
}

export const GetVideoCallCurrentStatusService = async (SessionId) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/VideoCall/GetCurrentStatus/${SessionId}`, 
        method:"GET",
        body:{}
    });
}

export const GetVideoCallDetailsService = async (Id) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/VideoCall/GetVideoCallDetails/${Id}`, 
        method:"GET",
        body:{}
    });
}

export const GetVideoCallGetTokenService = async (Id) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/VideoCall/GetToken/${Id}`, 
        method:"GET",
        body:{}
    });
}

export const GetVideoCallGetTestTokenService = async (Id) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/VideoCall/Test/${Id}`, 
        method:"GET",
        body:{}
    });
}
//*video call*

export const GetAllDakshinaService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Dakshina/GetAll`, 
        method:"GET",
        body:{}
    });
}
export const CreateDakshinaTransactionService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Dakshina/CreateDakshinaTransaction`, 
        method:"POST",
        body:body
    });
}
export const ValidateCodeService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Wallet/ValidateCode`, 
        method:"POST",
        body:body
    });
}
export const ApplyVoucherService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Wallet/ApplyVoucher`, 
        method:"POST",
        body:body
    });
}
//*************************/

//*********chakra**********/
export const GetChakraTodayStatusService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Chakra/GetTodayStatus`, 
        method:"GET",
        body:{}
    });
}
export const GetChakraService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Chakra/Get`, 
        method:"GET",
        body:{}
    });
}
export const CreateChakraTransactionService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Chakra/CreateTransaction`, 
        method:"POST",
        body:body
    });
}
//*************************/


export const GetCurrentServiceStatusService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Service/GetCurrentServiceStatus`, 
        method:"GET",
        body:{}
    });
}
export const GetNotificationService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Notification/GetAll`, 
        method:"GET",
        body:{}
    });
}
export const GetNotificationNewCountService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Notification/NewCount`, 
        method:"GET",
        body:{}
    });
}

export const GetMandirPujaListService = async (q, PageNo, RequestPerPage) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Mandir/GetPuja?PageNo=${PageNo}&RequestPerPage=${RequestPerPage}&q=${q}`, 
        method:"GET",
        body:{}
    });
}

export const GetMandirPujaListByFiltersService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Mandir/GetPujaByFilters`, 
        method:"POST",
        body:body
    });
}

export const GetMandirPujaFiltersService = async (q, PageNo, RequestPerPage) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Mandir/GetPujaFilters`, 
        method:"GET",
        body:{}
    });
}
export const GetMandirRecommendedPujaListService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Mandir/GetRecommendedPuja`, 
        method:"GET",
        body:{}
    });
}
export const GetRecommendedGemstonListService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Mandir/GetRecommendedGemston`, 
        method:"GET",
        body:{}
    });
}

export const GetMandirPujaByIdService = async (Id) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Mandir/GetPujaById?id=${Id}`, 
        method:"GET",
        body:{}
    });
}

export const GetMandirPujaSlotService = async (Date, PujaId) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Mandir/GetPujaSlot?Days=${Date}&PujaId=${PujaId}`, 
        method:"GET",
        body:{}
    });
}

export const Save_MandirPuja_BookingService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Mandir/Save_Puja_Booking`, 
        method:"POST",
        body:body
    });
}

export const Update_Puja_BookingService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Mandir/Update_Puja_Booking`, 
        method:"POST",
        body:body
    });
}

export const PujaRedeemCouponService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Mandir/RedeemCoupon`, 
        method:"POST",
        body:body
    });
}

export const PujaMyPujaBookingsCouponService = async (PageNo, RequestPerPage) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Mandir/MyPujaBookings?PageNo=${PageNo}&RequestPerPage=${RequestPerPage}`, 
        method:"GET",
        body:{}
    });
}

export const PujaReview_Rating_Puja_BookingService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Mandir/Review_Rating_Puja_Booking`, 
        method:"POST",
        body:body
    });
}

export const PujaMyPujaBookingsDetailsByIdService = async (id) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Mandir/MyPujaBookingsDetailsById?id=${id}`, 
        method:"GET",
        body:{}
    });
}

export const PujaCancel_Puja_BookingService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Mandir/Cancel_Puja_Booking`, 
        method:"POST",
        body:body
    });
}

export const PujaReschedule_Puja_BookingService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Mandir/Reschedule_Puja_Booking`, 
        method:"POST",
        body:body
    });
}

export const PujaGetPujaSlot_60DaysService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Mandir/GetPujaSlot_60Days`, 
        method:"GET",
        body:{}
    });
}

export const GetMandirVideoCallGetTokenService = async (Id) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/MandirVideoCall/GetToken/${Id}`, 
        method:"GET",
        body:{}
    });
}

export const GetMandirVideoCallDetailsService = async (Id) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/MandirVideoCall/GetVideoCallDetails/${Id}`, 
        method:"GET",
        body:{}
    });
}

export const MandirUpdateVideoCallStatusService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/MandirVideoCall/UpdateVideoCallStatus`, 
        method:"POST",
        body:body
    });
}

export const GetReferralService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Referral/GetReferral`, 
        method:"GET",
        body:{}
    });
}

export const GetWeeklyReferralService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Referral/GetWeeklyReferral`, 
        method:"GET",
        body:{}
    });
}

export const GetMonthlyReferralService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Referral/getMonthlyReferral`, 
        method:"GET",
        body:{}
    });
}

export const GetMyReferralListService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Referral/getMyReferralList`, 
        method:"GET",
        body:{}
    });
}

export const getReferralTermsService = async (type) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Referral/getReferralTerms_And_Conditions?type=${type}`, 
        method:"GET",
        body:{}
    });
}

export const getReferralFAQService = async (type) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Referral/getReferralFAQ?type=${type}`, 
        method:"GET",
        body:{}
    });
}
/*****MANDIR******/

export const Acharaya_AcharayaPujaBookingsUpcommingService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Mandir/AcharayaPujaBookingsUpcomming`, 
        method:"GET",
        body:{}
    });
}
export const Acharaya_PujaBookingsService = async (PageNo, RequestPerPage) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Mandir/Acharaya_PujaBookings?PageNo=${PageNo}&RequestPerPage=${RequestPerPage}`, 
        method:"GET",
        body:{}
    });
}
export const Acharaya_PujaBookings_Top1Service = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Mandir/Acharaya_PujaBookings_Top1`, 
        method:"GET",
        body:{}
    });
}
export const GetAcharaya_PujaSlot_60DaysService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Mandir/GetAcharaya_PujaSlot_60Days`, 
        method:"GET",
        body:{}
    });
}
export const GetPujaBookingsByIdService = async (id) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Mandir/GetPujaBookingsById?id=${id}`, 
        method:"GET",
        body:{}
    });
}
export const MandirInitVideoCallService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/MandirVideoCall/InitVideoCall`, 
        method:"POST",
        body:body
    });
}
export const MandirVideoCallGetCurrentStatusService = async (Id) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/MandirVideoCall/GetCurrentStatus/${Id}`, 
        method:"GET",
        body:{}
    });
}

export const GetLivePujaService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Mandir/GetLivePuja`, 
        method:"GET",
        body:{}
    });
}

export const Acharaya_Puja_Review_RatingService = async (Id) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Mandir/Acharaya_Puja_Review_Rating`, 
        method:"GET",
        body:{}
    });
}
export const FeedbackFileuploadService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Fileupload/Mandir/Feedback`, 
        method:"POST",
        body:body,
        isFormData:true
    });
}
export const Save_Puja_Review_Rating_AcharayaService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Mandir/Save_Puja_Review_Rating_Acharaya`, 
        method:"POST",
        body:body
    });
}
export const MandirContactusService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Mandir/Contactus`, 
        method:"POST",
        body:body
    });
}

/***/

/***Live*****/
export const GetExpertLiveSession_ScheduleService = async (date) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/ExpertliveSession/GetExpertLiveSession_Schedule?CtDate=${date}`, 
        method:"GET",
        body:{}
    });
}
export const GetLiveBackgroundImageAllService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/ExpertliveSession/GetLiveBackgroundImageAll`, 
        method:"GET",
        body:{}
    });
}
export const GetLiveSession_ScheduleSlotbyDateService = async (date) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/ExpertliveSession/GetLiveSession_ScheduleSlotbyDate?CtDate=${date}`, 
        method:"GET",
        body:{}
    });
}
export const Add_Update_Schedule_Live_SessionService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/ExpertliveSession/Add_Update_Schedule_Live_Session`, 
        method:"POST",
        body:body
    });
}
export const ExpertliveSessionCreateLiveSessionService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/ExpertliveSession/CreateLiveSession`, 
        method:"POST",
        body:body
    });
}
export const DeleteLive_SessionbyIdService = async (Id) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/ExpertliveSession/DeleteLive_SessionbyId?Id=${Id}`, 
        method:"GET",
        body:{}
    });
}
export const GetLive_SessionbyIdService = async (Id) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/ExpertliveSession/GetLive_SessionbyId?Id=${Id}`, 
        method:"GET",
        body:{}
    });
}
export const ExpertliveSessionInitLiveService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/ExpertliveSession/InitLive`, 
        method:"POST",
        body:body
    });
}
export const ExpertliveSessionCallWattingService = async (Id) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/ExpertliveSession/CallWatting/${Id}`, 
        method:"GET",
        body:{}
    });
}
export const ExpertliveSessionUpdateCallStatusService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/ExpertliveSession/UpdateCallStatus`, 
        method:"POST",
        body:body
    });
}
export const ExpertliveSessionCloseSessionService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/ExpertliveSession/CloseSession`, 
        method:"POST",
        body:body
    });
}
export const ExpertliveSessionGetSettingsService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/ExpertliveSession/GetSettings`, 
        method:"GET",
        body:{}
    });
}
export const ExpertliveSessionUpdateSettingService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/ExpertliveSession/UpdateSetting`, 
        method:"POST",
        body:body
    });
}
export const ExpertliveSessionBlockUserService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/ExpertliveSession/SetBlockUser`, 
        method:"POST",
        body:body
    });
}

export const UserliveSessionService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/UserliveSession/GetAll`, 
        method:"GET",
        body:{}
    });
}
export const UserliveSessionByIdService = async (Id) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/UserliveSession/Get/${Id}`, 
        method:"GET",
        body:{}
    });
}
export const UserliveSessionNotifyMeService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/UserliveSession/NotifyMe`, 
        method:"POST",
        body:body
    });
}
export const UserliveSessionInitLiveService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/UserliveSession/InitLive`, 
        method:"POST",
        body:body
    });
}
export const UserliveSessionInitLivChateService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/UserliveSession/InitLiveChat`, 
        method:"POST",
        body:body
    });
}
export const UserliveSessionInitCallService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/UserliveSession/InitCall`, 
        method:"POST",
        body:body
    });
}
export const UserliveSessionGetSessionStatusService = async (Id) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/UserliveSession/GetSessionStatus/${Id}`, 
        method:"GET",
        body:{}
    });
}
export const UserliveSessionGetCallStatusService = async (Id) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/UserliveSession/GetCallStatus/${Id}`, 
        method:"GET",
        body:{}
    });
}
export const UserliveSessionSetBookmarkService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/UserliveSession/SetBookmark`, 
        method:"POST",
        body:body
    });
}
export const UserliveSessionGetAllDakshinaService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/UserliveSession/Dakshina/GetAll`, 
        method:"GET",
        body:body
    });
}
export const UserliveSessionCreateDakshinaTransactionService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/UserliveSession/Dakshina/CreateDakshinaTransaction`, 
        method:"POST",
        body:body
    });
}
export const UserliveSessionUpdateCallStatusService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/UserliveSession/UpdateCallStatus`, 
        method:"POST",
        body:body
    });
}
export const UserliveSessionCloseSessionService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/UserliveSession/CloseSession`, 
        method:"POST",
        body:body
    });
}
export const UserliveSessionSaveFeedbackService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/UserliveSession/SaveFeedback`, 
        method:"POST",
        body:body
    });
}
export const UserliveSessionLikeService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/UserliveSession/Like`, 
        method:"POST",
        body:body
    });
}
export const UserliveSessionBlockUserService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/UserliveSession/SetBlockUser`, 
        method:"POST",
        body:body
    });
}

export const liveSessionPushMessageService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/liveSession/PushMessage`, 
        method:"POST",
        body:body
    });
}
export const liveSessionActiveCallersService = async (Id) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/liveSession/ActiveCallers/${Id}`, 
        method:"GET",
        body:{}
    });
}
export const liveSessionGetBadgesService = async (Id) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/liveSession/GetBadges/${Id}`, 
        method:"GET",
        body:{}
    });
}
export const liveSessionGetSessionDetailsService = async (Id) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/liveSession/SessionDetails/${Id}`, 
        method:"GET",
        body:{}
    });
}
/***/

/******Gau seva******** */
export const GetBalanceRewardService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Reward/GetBalance`, 
        method:"GET",
        body:{}
    });
}
export const GetImageGalleryGauSevaService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/GauSeva/ImageGallery`, 
        method:"GET",
        body:{}
    });
}
export const GetFaqsGauSevaService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/GauSeva/Faqs`, 
        method:"GET",
        body:{}
    });
}
export const GetTotalFeedsGauSevaService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/GauSeva/GetTotalFeeds`, 
        method:"GET",
        body:{}
    });
}
export const GetTransactionsGauSevaService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/GauSeva/Transactions`, 
        method:"GET",
        body:{}
    });
}
export const BuyFeedFromRewardGauSevaService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Reward/BuyFeedFromReward`, 
        method:"POST",
        body:body
    });
}
export const GetBuyMealsGauSevaService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/GauSeva/GetBuyMeals`, 
        method:"GET",
        body:{}
    });
}
export const CreateTransactionGauSevaService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/GauSeva/BuyMeals/CreateTransaction`, 
        method:"POST",
        body:body
    });
}
export const CompleteTransactionGauSevaService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/GauSeva/BuyMeals/CompleteTransaction`, 
        method:"POST",
        body:body
    });
}
export const SetTaxRebateGauSevaService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/GauSeva/SetTaxRebate`, 
        method:"POST",
        body:body
    });
}
/***/
export const Save_Vendor_TransactionService = async (body) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Vendor/Save_Vendor_Transaction`, 
        method:"POST",
        body:body
    });
}
export const WhatsApp_Communication_NumberService = async (ContactUS) => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/WhatsApp_Communication_Number/GetDetailsByName?Name=${ContactUS}`, 
        method:"GET",
        body:{}
    });
}
export const getDaily_Vendor_reportsService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Vendor/getDaily_Vendor_reports`, 
        method:"GET",
        body:{}
    });
}
export const getMonthly_Vendor_reportsService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Vendor/getMonthly_Vendor_reports`, 
        method:"GET",
        body:{}
    });
}
export const get_Vendor_Payout_reportsService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Vendor/get_Vendor_Payout_reports`, 
        method:"GET",
        body:{}
    });
}
export const LogoutService = async () => {
    return GetDateFromServer({
        uri:`api/${env.API_VERSION}/Account/Logout`, 
        method:"POST",
        body:{}
    });
}

const bueruBaseUrl='https://api.bureau.id/';
const bueruClientId='5f87bca2-1bde-4c39-a176-a3620149dd79';
const bueruCallback='';
const bueruCountryCode='IN';

export const BureauAuthService = (body) => {
    //var body={transactionId:"bcac2be5-cd70-4a0d-bda2-c9c63cd2e982", mobile:"919999999999"}

    const promise = new Promise(async (resolve, reject) => {
        var url=`${bueruBaseUrl}v2/auth/initiate?clientId=${bueruClientId}&countryCode=${bueruCountryCode}&transactionId=${body.transactionId}&mobile=${body.mobile}&callback=${bueruCallback}`;
        console.log("url", url);
        fetch(url)
        .then((response) => response.json())
        .then(resp=>resolve(resp))
        .catch(err=>reject(err));
    });
    return promise;
}

const GetDateFromServer = async ({ uri, method, body, provider, isFormData, IsDeviceId }) => {
    var headers = env.headers;
    headers.Authorization = await Auth.Access_Token();
    headers.UniqueDeviceId = DeviceInfo.getUniqueId();

    if(isFormData)
    headers['Content-Type'] = 'multipart/form-data';
    else headers['Content-Type'] = 'application/json';

    var BASE_URL = env.BASE_URL;
    
    if(IsDeviceId){
        try{
            const FCMtoken=await Auth.getFCMToken();
            headers.DeviceId=FCMtoken;
        } 
        catch(e){console.error("err GetDateFromServer headers.DeviceId=await Auth.getFCMToken()", e)}
    }


    const promise = new Promise(async (resolve, reject) => {
        try {
            var request = {
                method: method,
                headers: headers,
            }
            if (method == "POST") {
                if(isFormData){
                    request.body = body
                }
                else{
                    request.body = JSON.stringify(body)
                }
            }

            //console.log("uri", `${BASE_URL}${uri}`);
            //console.log("headers", headers);
            //console.log("request", request) 

            fetch(`${BASE_URL}${uri}`, request)
                .then((response) => response.json())
                .then((json) => {
                    //console.log(json);
                    if(json.data==null){
                        resolve(json);
                    }

                    try{
                        json.data = jwtDecode(json.data);
                        resolve(json);
                    }
                    catch{
                        console.log("err jwtDecode")
                        json.data = null;
                        resolve(json);
                    }
                })
                .catch((error) => {
                    console.log("err", error);
                    reject(error);
                })

        } catch (msg) {
            console.log("err", msg);
            reject(msg);
        }
    });
    return promise;
}