import { getApplications } from '@/api/apiApplications';
import useFetch from '@/hooks/use-fetch';
import { useUser } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import ApplicationCard from './ApplicationCard';
import { BarLoader } from 'react-spinners';

const CreatedApplications = () => {

    const {user} = useUser();

    const {
        loading: loadingApplications,
        data: applications,
        fn: fnApplications,
    } = useFetch(getApplications, {
        user_id: user.id,
    });

    useEffect(() => {
        fnApplications();
    },[]);

    if(loadingApplications) {
        return <BarLoader className='mb-4' width={"100%"} color='#cdc6c4' />
      }
    
  return (
    <div className='flex flex-col gap-2'>
        {applications && applications.map((application) => {
            return <ApplicationCard key={application.id} application={application} isCandidate />
          })}
    </div>
  )
}

export default CreatedApplications