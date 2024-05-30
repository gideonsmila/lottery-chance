// app/page.tsx

import React from 'react';

interface ProjectData {
  projects: any[];
}

const fetchProjectData = async (): Promise<ProjectData> => {
  const res = await fetch('https://www.dira.moch.gov.il/api/Invoker?method=Projects&param=%3FProjectStatus%3D4%26Entitlement%3D1%26PageNumber%3D1%26PageSize%3D50%26IsInit%3Dtrue%26');
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const data: any = await res.json();
//
  const reducedDataByCity = data.ProjectItems.reduce((acc: any, cur: any) => {
      const city = acc.find((el: any) => el.CityDescription === cur.CityDescription )
      if(city) {
        city.TargetHousingUnits = city.TargetHousingUnits + cur.TargetHousingUnits
        city.TotalSubscribers = city.TotalSubscribers + cur.TotalSubscribers;
        city.TotalLocalSubscribers = city.TotalLocalSubscribers + (cur.TotalLocalSubscribers || 0);
        city.HousingUnitsForHandicapped = city.HousingUnitsForHandicapped + (cur.HousingUnitsForHandicapped || 0);
        city.LocalHousing = city.LocalHousing + (cur.LocalHousing || 0)
      }
      else {
        acc.push(cur)
      }
      return acc;
  },[])

  
 
  return reducedDataByCity.map((el: any) => ({
    ApplicationStartDate: el.ApplicationStartDate,
    ApplicationEndDate: el.ApplicationEndDate,
    ProcessName: el.ProcessName,
    CityDescription: el.CityDescription,
    ContractorDescription: el.ContractorDescription,
    TargetHousingUnits: el.TargetHousingUnits,
    PricePerUnit: el.PricePerUnit,
    TotalSubscribers: el.TotalSubscribers,
    TotalLocalSubscribers: el.TotalLocalSubscribers || 0,
    WinningPercentage: (el.TargetHousingUnits - el.HousingUnitsForHandicapped - el.LocalHousing) / ((el.TotalSubscribers - el.TotalLocalSubscribers || 0)) * 100,
  })).sort((a: any,b: any) => b.WinningPercentage - a.WinningPercentage);
};

const Home = async () => {
  const data: any = await fetchProjectData();

  return (
    <div>
       <header className="mb-4 text-center">
        <h1 className="text-2xl font-bold mb-2 text-smoke-white">מחיר למשתכן אחוזי זכייה</h1>
      </header>
      <div className="p-4">
      

      <h1 className="text-2xl font-bold mb-4 text-black">Projects Data</h1>
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-black">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-black">Application Start Date</th>
              <th className="py-2 px-4 border-b text-black">Application End Date</th>
              <th className="py-2 px-4 border-b text-black">Process Name</th>
              <th className="py-2 px-4 border-b text-black">City Description</th>
              <th className="py-2 px-4 border-b text-black">Contractor Description</th>
              <th className="py-2 px-4 border-b text-black">Target Housing Units</th>
              <th className="py-2 px-4 border-b text-black">Price Per Unit</th>
              <th className="py-2 px-4 border-b text-black">Total Subscribers</th>
              <th className="py-2 px-4 border-b text-black">Total Local Subscribers</th>
              <th className="py-2 px-4 border-b text-black">Winning Percentage</th>
            </tr>
          </thead>
          <tbody>
            {data.map((project: any, index: any) => (
              <tr key={index} className="text-black">
                <td className="py-2 px-4 border-b text-black">{new Date(project.ApplicationStartDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b text-black">{new Date(project.ApplicationEndDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b text-black">{project.ProcessName}</td>
                <td className="py-2 px-4 border-b text-black">{project.CityDescription}</td>
                <td className="py-2 px-4 border-b text-black">{project.ContractorDescription}</td>
                <td className="py-2 px-4 border-b text-black">{project.TargetHousingUnits}</td>
                <td className="py-2 px-4 border-b text-black">{project.PricePerUnit}</td>
                <td className="py-2 px-4 border-b text-black">{project.TotalSubscribers}</td>
                <td className="py-2 px-4 border-b text-black">{project.TotalLocalSubscribers}</td>
                <td className="py-2 px-4 border-b text-lime-700 font-bold">{project.WinningPercentage.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="block md:hidden">
        {data.map((project: any, index: any) => (
          <div key={index} className="mb-4 p-4 bg-white border border-gray-200 text-black rounded-lg shadow-md">
            <div className="mb-2 text-black"><strong>Application Start Date:</strong> {new Date(project.ApplicationStartDate).toLocaleDateString()}</div>
            <div className="mb-2 text-black"><strong>Application End Date:</strong> {new Date(project.ApplicationEndDate).toLocaleDateString()}</div>
            <div className="mb-2 text-black"><strong>Process Name:</strong> {project.ProcessName}</div>
            <div className="mb-2 text-black"><strong>City Description:</strong> {project.CityDescription}</div>
            <div className="mb-2 text-black"><strong>Contractor Description:</strong> {project.ContractorDescription}</div>
            <div className="mb-2 text-black"><strong>Target Housing Units:</strong> {project.TargetHousingUnits}</div>
            <div className="mb-2 text-black"><strong>Price Per Unit:</strong> {project.PricePerUnit}</div>
            <div className="mb-2 text-black"><strong>Total Subscribers:</strong> {project.TotalSubscribers}</div>
            <div className="mb-2 text-black"><strong>Total Local Subscribers:</strong> {project.TotalLocalSubscribers}</div>
            <div className="mb-4 text-lime-700 font-bold "><strong>Winning Percentage:</strong> {project.WinningPercentage.toFixed(2)}%</div>
          </div>
        ))}
      </div>
    </div>
    </div>
   
  );
};

export default Home;
