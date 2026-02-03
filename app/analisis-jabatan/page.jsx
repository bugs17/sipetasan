import React from 'react'

const Page = () => {
  return (
    <div className='p-5 h-full overflow-y-auto '>
        <div className=" h-full">

        <div className='pb-32'>

          <div className="overflow-hidden rounded-lg border border-gray-300 ">
            <table className="table w-full ">
              {/* head */}
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="border-r border-gray-300"></th>
                  <th className="border-r border-gray-300 text-center align-middle">Nama</th>
                  <th className="border-r border-gray-300 text-center align-middle">Job</th>
                  <th className='text-center align-middle'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                <tr className="bg-base-200 border-b border-gray-300">
                  <th className="border-r border-gray-300">1</th>
                  <td className="border-r border-gray-300">Cy Ganderton</td>
                  <td className="border-r border-gray-300">Quality Control Specialist</td>
                  <td className='flex justify-center items-center gap-2'>
                    <button className="btn bg-violet-500 text-white hover:bg-violet-800 btn-sm ">Tambah</button>
                  </td>
                </tr>
                
              </tbody>
            </table>
          </div>
        </div>

        </div>
    </div>
  )
}

export default Page