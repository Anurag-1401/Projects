from fastapi import APIRouter

from routes import adminRoute , studentRoute ,roomRoute , visitorRoute , studentLoginRoute ,attendanceRoute, complaintsRoute,leaveRoute ,paymentRoute,tokenRoute,assistantRoute




router = APIRouter()


router.include_router(adminRoute.router)

router.include_router(studentRoute.router)

router.include_router(studentLoginRoute.router)

router.include_router(roomRoute.router)

router.include_router(visitorRoute.router)

router.include_router(attendanceRoute.router)

router.include_router(complaintsRoute.router)

router.include_router(leaveRoute.router)

router.include_router(paymentRoute.router)

router.include_router(tokenRoute.router)

router.include_router(assistantRoute.router)


