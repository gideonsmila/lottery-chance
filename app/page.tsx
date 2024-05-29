// app/page.tsx

import React from 'react';

interface ProjectData {
  // Define the shape of the data you expect from the API
  projects: any[];
}

const fetchProjectData = async (): Promise<ProjectData> => {
  const res = await fetch('https://www.dira.moch.gov.il/api/Invoker?method=Projects&param=%3FProjectStatus%3D4%26Entitlement%3D1%26PageNumber%3D1%26PageSize%3D50%26IsInit%3Dtrue%26');
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const data: any = await res.json();
 
  return data.ProjectItems.map((el: any) => ({
    ApplicationStartDate: el.ApplicationStartDate,
    ApplicationEndDate: el.ApplicationEndDate,
    ProcessName: el.ProcessName,
    CityDescription: el.CityDescription,
    ContractorDescription: el.ContractorDescription,
    TargetHousingUnits: el.TargetHousingUnits,
    PricePerUnit: el.PricePerUnit,
    TotalSubscribers: el.TotalSubscribers,
    TotalLocalSubscribers: el.TotalLocalSubscribers || 0,
    WinningPercentage: el.TargetHousingUnits / ((el.TotalSubscribers - el.TotalLocalSubscribers || 0)) * 100,
  }));
};

const Home = async () => {
  const data: any = await fetchProjectData();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-black">Projects Data</h1>
      <div className="overflow-x-auto">
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
                <td className="py-2 px-4 border-b text-black">{project.WinningPercentage.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
