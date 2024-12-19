import { supabase } from "@/lib/supabase";

// TODO: Implement the getUserData function

// export const getUserData = async (userId) => {
//   try {
//     const response = await fetch('https://ryrdvylrircqvwjuivex.supabase.co/rest/v1/users', {
//       method: 'GET',
//       headers: {
//         'apikey': process.env.EXPO_PUBLIC_API_KEY, // Replace with your actual Supabase key
//         'Authorization': `Bearer ${process.env.EXPO_PUBLIC_API_KEY}`,
//       },
//     });

//     // Check if the request was successful
//     if (!response.ok) {
//       throw new Error(`Failed to fetch: ${response.statusText}`);
//     }

//     // Parse the response data
//     const data = await response.json();

//     return { success: true, data };

//   } catch (error) {
//     console.log("error", error);
//     return { success: false, msg: error.message };
//   }
// };


export const getUserData = async (userId) => {
  try {
    const { data, error } = await supabase.from('users').select().eq('id', userId).single();

    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true, data
    };

  } catch (error) {
    console.log("error", error);
    return {
      success: false, msg: error.message
    };

  }

}
