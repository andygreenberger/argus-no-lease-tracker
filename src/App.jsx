import { useState, useEffect, useCallback } from "react";

// ─── SUPABASE CLIENT ──────────────────────────────────────────────────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const sb = async (path, options = {}) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": options.prefer || "return=representation",
      ...options.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : [];
};

// ─── SEED DATA ───────────────────────────────────────────────────────────────
const FACILITIES_DATA = [{"name":"Stor-More Muller","code":"L193","state":"TX","managerName":"Sara Tamez","managerEmail":"muller@stormorelaredo.com","dmName":"Adel Westbury","dmEmail":"awestbury@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"Stor-More Industrial","code":"L194","state":"TX","managerName":"Jessica Saenz","managerEmail":"industrial@stormorelaredo.com","dmName":"Adel Westbury","dmEmail":"awestbury@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"Spare Feet Self Storage - Abilene","code":"L152","state":"TX","managerName":"Helen De La Rosa","managerEmail":"abilene@sparefeet.com","dmName":"Adel Westbury","dmEmail":"awestbury@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"U Store It - Abilene 1850","code":"L049","state":"TX","managerName":"Mandy Daniels","managerEmail":"ustoreit1850@ustoreitabilene.com","dmName":"Adel Westbury","dmEmail":"awestbury@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"U Store It - Abilene 2826","code":"L046","state":"TX","managerName":"Katie Jones","managerEmail":"manager@ustoreitabilene.com","dmName":"Adel Westbury","dmEmail":"awestbury@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"Rodeo Storage","code":"L372","state":"TX","managerName":"Loretta Todd","managerEmail":"manager@rodeo-storage.com","dmName":"Adel Westbury","dmEmail":"awestbury@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"Crestway Parking & Storage","code":"L216","state":"TX","managerName":"Melissa Perez","managerEmail":"manager@crestwaystorageandparking.com","dmName":"Adel Westbury","dmEmail":"awestbury@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"U Store It - Abilene 818","code":"L048","state":"TX","managerName":"Mandy Daniels","managerEmail":"ustoreit818@ustoreitabilene.com","dmName":"Adel Westbury","dmEmail":"awestbury@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"Spare Feet Self Storage - Odessa","code":"L224","state":"TX","managerName":"Michelle Brannon","managerEmail":"odessa@sparefeet.com","dmName":"Adel Westbury","dmEmail":"awestbury@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"Alameda West Storage","code":"L343","state":"NM","managerName":"Linda Arellano","managerEmail":"manager@alamedaweststorage.com","dmName":"Alma Garcia De Mirabal","dmEmail":"amirabal@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"U Store It - Lovington Storage","code":"L039","state":"NM","managerName":"Maryellen Garcia","managerEmail":"manager@lovingtonselfstorage.com","dmName":"Alma Garcia De Mirabal","dmEmail":"amirabal@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"AAA U-Lock-It 1417 Cardenas","code":"L012","state":"NM","managerName":"Lori Pineda","managerEmail":"2125@aaaulockitselfstorage.com","dmName":"Alma Garcia De Mirabal","dmEmail":"amirabal@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"AAA U-Lock-It Self Storage - 2125","code":"L011","state":"NM","managerName":"Lori Pineda","managerEmail":"2125@aaaulockitselfstorage.com","dmName":"Alma Garcia De Mirabal","dmEmail":"amirabal@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"AAA U-Lock-It Self Storage - 2200","code":"L010","state":"NM","managerName":"Hearther Fuentes","managerEmail":"3131@aaaulockitselfstorage.com","dmName":"Alma Garcia De Mirabal","dmEmail":"amirabal@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"I-25 Self Storage w/ RV & Boat","code":"L279","state":"NM","managerName":"BobbiJo Jones","managerEmail":"info@selfstoragei25.com","dmName":"Alma Garcia De Mirabal","dmEmail":"amirabal@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"Volcano Self Storage","code":"L333","state":"NM","managerName":"Janine Williams","managerEmail":"manager@volcanoselfstorage.com","dmName":"Alma Garcia De Mirabal","dmEmail":"amirabal@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"U Store It - Carlsbad","code":"L036","state":"NM","managerName":"Ashley Carbajal","managerEmail":"manager@ustoreitcarlsbad.com","dmName":"Alma Garcia De Mirabal","dmEmail":"amirabal@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"AAA U-Lock-It Self Storage - 3131","code":"L009","state":"NM","managerName":"Hearther Fuentes","managerEmail":"3131@aaaulockitselfstorage.com","dmName":"Alma Garcia De Mirabal","dmEmail":"amirabal@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"Eagle Self Storage","code":"L332","state":"NM","managerName":"Brittney Gonzalez","managerEmail":"manager@eaglestoragehobbs.com","dmName":"Alma Garcia De Mirabal","dmEmail":"amirabal@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"American Self Storage - Albuquerque","code":"L322","state":"NM","managerName":"Sean Shepard","managerEmail":"manager@albqstorage.com","dmName":"Alma Garcia De Mirabal","dmEmail":"amirabal@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"A-Secured RV & Vehicle Storage","code":"L027","state":"AZ","managerName":"Shere Keegan","managerEmail":"manager@asecuredrvstorage.com","dmName":"Alyssa Rios","dmEmail":"arios@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Casa Grande Self Storage","code":"L146","state":"AZ","managerName":"Tina Morrison","managerEmail":"contact@casagrandeministorage.com","dmName":"Alyssa Rios","dmEmail":"arios@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"American Self Storage - Yuma","code":"L101","state":"AZ","managerName":"Diane Malloy","managerEmail":"manager@americanselfstorageyuma.com","dmName":"Alyssa Rios","dmEmail":"arios@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"StorageMax - Yuma","code":"L177","state":"AZ","managerName":"Chelsea Snobar","managerEmail":"manager@storagemaxyuma.com","dmName":"Alyssa Rios","dmEmail":"arios@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Fort Lowell Self Storage","code":"L398","state":"AZ","managerName":"Mia Mendoza","managerEmail":"manager@fortlowellselfstorage.com","dmName":"Alyssa Rios","dmEmail":"arios@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"51st Ave Self Storage","code":"L319","state":"AZ","managerName":"Ashley Banks","managerEmail":"manager@51staveselfstorage.com","dmName":"Alyssa Rios","dmEmail":"arios@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Thornydale Self Storage","code":"L399","state":"AZ","managerName":"Ylaena Jumper","managerEmail":"manager@thornydaleselfstorage.com","dmName":"Alyssa Rios","dmEmail":"arios@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Northwest RV & Self Storage","code":"L365","state":"AZ","managerName":"Ashley Beaupre","managerEmail":"northwestselfstorage@gmail.com","dmName":"Alyssa Rios","dmEmail":"arios@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Rita Ranch RV & Self Storage","code":"L057","state":"AZ","managerName":"Chris Merchant","managerEmail":"manager@ritaranchstorage.com","dmName":"Alyssa Rios","dmEmail":"arios@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Premier RV Storage","code":"L098","state":"AZ","managerName":"Ashley Beaupre","managerEmail":"Manager@premiervehiclestoragemarana.com","dmName":"Alyssa Rios","dmEmail":"arios@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Tempe Self Storage","code":"L390","state":"AZ","managerName":"Trevon Culberson","managerEmail":"manager@tempeselfstorage.com","dmName":"Alyssa Rios","dmEmail":"arios@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"El Camino Self Storage - De La Cruz","code":"L436","state":"CA","managerName":"Diana Mcdermott","managerEmail":"delacruz@elcaminoselfstorageca.com","dmName":"Alyssa Rios","dmEmail":"arios@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"El Camino Self Storage - Memorex","code":"L435","state":"CA","managerName":"Ernesto Huerta","managerEmail":"memorex@elcaminoselfstorageca.com","dmName":"Alyssa Rios","dmEmail":"arios@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Xtra Space Storage","code":"L260","state":"AZ","managerName":"Jason Hofmann","managerEmail":"xtraspace11010@gmail.com","dmName":"Amy Gomez","dmEmail":"agomez@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Access Self Storage","code":"L143","state":"AZ","managerName":"Steve Cass","managerEmail":"manager@selfstoragecampverde.com","dmName":"Amy Gomez","dmEmail":"agomez@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Tygar Self Storage","code":"L140","state":"AZ","managerName":"Tally Cass","managerEmail":"manager@tygarstorage.com","dmName":"Amy Gomez","dmEmail":"agomez@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Alpha Self Storage","code":"L085","state":"AZ","managerName":"Christian McBride","managerEmail":"manager@alphaselfstorage.com","dmName":"Amy Gomez","dmEmail":"agomez@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Vista Boat & RV Storage - Queen Creek","code":"L287","state":"AZ","managerName":"Larry Hunt","managerEmail":"queencreek@vistaboatandrvstorage.com","dmName":"Amy Gomez","dmEmail":"agomez@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Arizona Covered RV & Boat Storage","code":"L417","state":"AZ","managerName":"Toni Wolfcale","managerEmail":"manager@azcoveredrvboatstorage.com","dmName":"Amy Gomez","dmEmail":"agomez@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Vista Boat & RV Storage - Tempe","code":"L288","state":"AZ","managerName":"Larry Hunt","managerEmail":"tempe@vistaboatandrvstorage.com","dmName":"Amy Gomez","dmEmail":"agomez@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"L&L Mini Storage","code":"L307","state":"CO","managerName":"","managerEmail":"manager@cortezstorage.net","dmName":"Brian Levine","dmEmail":"blevine@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Evans Self Storage","code":"L255","state":"CO","managerName":"Johnny","managerEmail":"manager@evansselfstorage.com","dmName":"Brian Levine","dmEmail":"blevine@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Mary's Magazine Self Storage","code":"L097","state":"CO","managerName":"Brynna Buchholz","managerEmail":"manager@marysmagazineselfstorage.com","dmName":"Brian Levine","dmEmail":"blevine@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Nest Self Storage- Brighton","code":"L418","state":"CO","managerName":"Cynthia Molzan","managerEmail":"Brighton@nestselfstorage.com","dmName":"Brian Levine","dmEmail":"blevine@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Vapor Trail RV, Boat & Commercial Storage","code":"L381","state":"CO","managerName":"Bryan Gann","managerEmail":"manager@vaportrailstorage.com","dmName":"Brian Levine","dmEmail":"blevine@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"My Storage at Jackson Creek","code":"L019","state":"CO","managerName":"Brittany Jenkins","managerEmail":"manager@mystorageatjacksoncreek.com","dmName":"Brian Levine","dmEmail":"blevine@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Maximum Storage RV & Self Storage","code":"L060","state":"CO","managerName":"Sera Helton","managerEmail":"Manager@MaximumStorageCo.com","dmName":"Brian Levine","dmEmail":"blevine@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"New Frontier Self Storage - Monument","code":"L421","state":"CO","managerName":"Alyssa Legett","managerEmail":"monument@newfrontierselfstorage.com","dmName":"Brian Levine","dmEmail":"blevine@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Belmont Self Storage","code":"L298","state":"CO","managerName":"Destin Mace","managerEmail":"manager@selfstoragebelmont.com","dmName":"Brian Levine","dmEmail":"blevine@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Broadmoor Storage","code":"L324","state":"CO","managerName":"Bridgett Sovaiko","managerEmail":"manager@broadmoorstorageco.com","dmName":"Brian Levine","dmEmail":"blevine@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Academy South Mini Storage","code":"L103","state":"CO","managerName":"John Cruz","managerEmail":"manager@academysouthstorage.com","dmName":"Brian Levine","dmEmail":"blevine@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Nest Self Storage- Lafayette","code":"L419","state":"CO","managerName":"Cynthia Molzan","managerEmail":"lafayette@nestselfstorage.com","dmName":"Brian Levine","dmEmail":"blevine@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Inner Space Mini Storage","code":"L025","state":"AZ","managerName":"Eva Hudman","managerEmail":"manager@innerspaceselfstorage.com","dmName":"Carla Banks","dmEmail":"cbanks@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"StorEZ- Scottsdale","code":"L199","state":"AZ","managerName":"Jessica McGinnis","managerEmail":"manager@storezscottsdale.com","dmName":"Carla Banks","dmEmail":"cbanks@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Green Valley Covered RV","code":"L099","state":"AZ","managerName":"June McHugh","managerEmail":"manager@greenvalleystorage.com","dmName":"Carla Banks","dmEmail":"cbanks@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"American Self Storage - Wilmot","code":"L225","state":"AZ","managerName":"Angela Suter","managerEmail":"manager@americanselfstorageaz.com","dmName":"Carla Banks","dmEmail":"cbanks@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Midway RV & Self Storage","code":"L080","state":"AZ","managerName":"Andy Aden","managerEmail":"manager@midwayselfstorage.net","dmName":"Carla Banks","dmEmail":"cbanks@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"First & River Self Storage","code":"L086","state":"AZ","managerName":"Sarah Castille","managerEmail":"manager@firstandriver.com","dmName":"Carla Banks","dmEmail":"cbanks@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"American Self Storage - Tucson","code":"L102","state":"AZ","managerName":"Elisha Harris","managerEmail":"manager@americanselfstoragetucson.com","dmName":"Carla Banks","dmEmail":"cbanks@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Continental Self Storage","code":"L284","state":"AZ","managerName":"Diana Booth","managerEmail":"manager@continentalselfstorage.com","dmName":"Carla Banks","dmEmail":"cbanks@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Auto Palace","code":"L305","state":"CA","managerName":"Corrina Fine","managerEmail":"manager@autopalaceautostore.com","dmName":"Carla Banks","dmEmail":"cbanks@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Canyon Lake Self Storage","code":"L321","state":"CA","managerName":"James Varney","managerEmail":"managercanyonlakestorage@gmail.com","dmName":"Carla Banks","dmEmail":"cbanks@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Aardvark Self Storage","code":"L400","state":"CA","managerName":"Sarah","managerEmail":"manager@aaardvarkstorage.com","dmName":"Carla Banks","dmEmail":"cbanks@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Richards Place Self Storage","code":"L142","state":"NV","managerName":"Sandi Hales","managerEmail":"manager@richardsplaceselfstorage.com","dmName":"Carla Banks","dmEmail":"cbanks@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Red Rock Mega Storage","code":"L257","state":"NV","managerName":"Loretta Dahill","managerEmail":"rrmsmanager@gmail.com","dmName":"Carla Banks","dmEmail":"cbanks@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"303 Self Storage Rino","code":"L266","state":"CO","managerName":"Geo Pierre","managerEmail":"rino@303selfstorage.com","dmName":"Christian Stookey","dmEmail":"cstookey@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"303 Self Storage Monaco","code":"L264","state":"CO","managerName":"Jeff Fuller","managerEmail":"monaco@303selfstorage.com","dmName":"Christian Stookey","dmEmail":"cstookey@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"303 Self Storage Broadway","code":"L265","state":"CO","managerName":"Fil Tekle & Rayvon Fisher","managerEmail":"broadway@303selfstorage.com","dmName":"Christian Stookey","dmEmail":"cstookey@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"303 Self Storage Arapahoe","code":"L308","state":"CO","managerName":"Tyler Korn","managerEmail":"arapahoe@303selfstorage.com","dmName":"Christian Stookey","dmEmail":"cstookey@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Brookridge Self Storage","code":"L403","state":"CO","managerName":"Jaime Sanchez","managerEmail":"manager@brookridgeselfstorage.com","dmName":"Christian Stookey","dmEmail":"cstookey@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Broadway Station Self Storage","code":"L109","state":"CO","managerName":"David Bills","managerEmail":"manager@broadwaystationselfstorage.com","dmName":"Christian Stookey","dmEmail":"cstookey@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"LoDo Self Storage & Moving Center","code":"L231","state":"CO","managerName":"Bob Velasquez","managerEmail":"manager@lodostorage.com","dmName":"Christian Stookey","dmEmail":"cstookey@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Johnstown Plaza Storage","code":"L371","state":"CO","managerName":"Mary Louis","managerEmail":"manager@johnstownplazastorage.com","dmName":"Christian Stookey","dmEmail":"cstookey@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"North Metro Self Storage","code":"L411","state":"MN","managerName":"Megan Luciano","managerEmail":"manager@northmetrostorage.com","dmName":"Christian Stookey","dmEmail":"cstookey@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Cambridge Self Storage","code":"L412","state":"MN","managerName":"Megan Luciano","managerEmail":"manager@isantiandcambridgestorage.com","dmName":"Christian Stookey","dmEmail":"cstookey@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"New Frontier Red Wing","code":"L261","state":"MN","managerName":"Kyle Gallardo","managerEmail":"redwing@newfrontierselfstorage.com","dmName":"Christian Stookey","dmEmail":"cstookey@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"New Frontier Hager City","code":"L212","state":"WI","managerName":"Kyle Gallardo","managerEmail":"hagercity@newfrontierselfstorage.com","dmName":"Christian Stookey","dmEmail":"cstookey@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"New Frontier Self Storage - Hudson","code":"L425","state":"WI","managerName":"Mary Louis","managerEmail":"hudson@newfrontierselfstorage.com","dmName":"Christian Stookey","dmEmail":"cstookey@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"New Frontier Self Storage - Spokane Valley","code":"L413","state":"WA","managerName":"Jacob Strebeck","managerEmail":"spokane@newfrontierselfstorage.com","dmName":"Cliff Lewis","dmEmail":"Clewis@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Havasu Boat Storage","code":"L061","state":"AZ","managerName":"Ashley Hutton","managerEmail":"manager@havasuboatstorageaz.com","dmName":"Clifford Lewis","dmEmail":"clewis@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"24-7 Automated Storage","code":"L168","state":"NV","managerName":"Alan Dorsey","managerEmail":"store0001@storage24x7.com","dmName":"Clifford Lewis","dmEmail":"clewis@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Maximum RV Storage, Lake Mead","code":"L078","state":"NV","managerName":"Anjanette Michelle Ard","managerEmail":"manager@maximumrvstorage.com","dmName":"Clifford Lewis","dmEmail":"clewis@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Highway 160 Self Storage","code":"L112","state":"NV","managerName":"Martha Pflanzer","managerEmail":"manager@highway160selfstorage.com","dmName":"Clifford Lewis","dmEmail":"clewis@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Clover Basin Self Storage","code":"L230","state":"CO","managerName":"Sterling Young","managerEmail":"manager@cloverbasinstorage.com","dmName":"David Bailey","dmEmail":"dbailey@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Boulder Storage Center","code":"L195","state":"CO","managerName":"Mary Louis","managerEmail":"manager@boulderstoragecenter.com","dmName":"David Bailey","dmEmail":"dbailey@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"DTC Self Storage","code":"L058","state":"CO","managerName":"Denice Eden","managerEmail":"contact@dtcselfstorage.com","dmName":"David Bailey","dmEmail":"dbailey@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"New Frontier College","code":"L318","state":"WY","managerName":"Scott Roberts","managerEmail":"college@newfrontierselfstorage.com","dmName":"David Bailey","dmEmail":"dbailey@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Dove Valley RV, Boat and Self Storage","code":"L416","state":"CO","managerName":"Tyler","managerEmail":"manager@dovevalleystorage.com","dmName":"David Bailey","dmEmail":"dbailey@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Metro - Chambers Self Storage","code":"L281","state":"CO","managerName":"Caitlynn Horn","managerEmail":"chambersselfstorage@gmail.com","dmName":"David Bailey","dmEmail":"dbailey@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Metro - Colfax West Self Storage","code":"L282","state":"CO","managerName":"Courtney Hays","managerEmail":"colfaxstorage@gmail.com","dmName":"David Bailey","dmEmail":"dbailey@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Metro - West Evans Self Storage","code":"L283","state":"CO","managerName":"Shane F","managerEmail":"westevansstorage@gmail.com","dmName":"David Bailey","dmEmail":"dbailey@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Golden Storage","code":"L071","state":"CO","managerName":"Kevin Martin","managerEmail":"manager@golden-storage.com","dmName":"David Bailey","dmEmail":"dbailey@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Broomfield Mini Storage","code":"L176","state":"CO","managerName":"Dave Szymanski","managerEmail":"manager@broomfield-storage.com","dmName":"David Bailey","dmEmail":"dbailey@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Hayward Self Storage","code":"L387","state":"CA","managerName":"Ann Nealon","managerEmail":"manager@haywardselfstorage.net","dmName":"Donna Lay","dmEmail":"dlay@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Sentry Storage Sunrise","code":"L079","state":"CA","managerName":"Joel Neilsen","managerEmail":"sunrisefolsom@sentrystorage.com","dmName":"Donna Lay","dmEmail":"dlay@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Sentry Storage- Shingle Springs","code":"L081","state":"CA","managerName":"Timothy Young","managerEmail":"shinglesprings@sentrystorage.com","dmName":"Donna Lay","dmEmail":"dlay@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Sentry Storage Madison","code":"L082","state":"CA","managerName":"Celeste Medina","managerEmail":"madaub@sentrystorage.com","dmName":"Donna Lay","dmEmail":"dlay@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Sentry Storage- Hazel 50","code":"L083","state":"CA","managerName":"Anita Osberg","managerEmail":"hazel50@sentrystorage.com","dmName":"Donna Lay","dmEmail":"dlay@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Sentry Storage- Greenback","code":"L084","state":"CA","managerName":"Sherri Blackwell","managerEmail":"greenback@sentrystorage.com","dmName":"Donna Lay","dmEmail":"dlay@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Sentry Storage- Elk Grove 1","code":"L087","state":"CA","managerName":"Marjorie Melgares-Cosgrove","managerEmail":"elkgrove1@sentrystorage.com","dmName":"Donna Lay","dmEmail":"dlay@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Sentry Storage- Elk Grove 2","code":"L089","state":"CA","managerName":"Gary Trevorow","managerEmail":"elkgrove2@sentrystorage.com","dmName":"Donna Lay","dmEmail":"dlay@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Sentry Storage- Folsom Dam","code":"L088","state":"CA","managerName":"Steven Carter","managerEmail":"folsomdam@sentrystorage.com","dmName":"Donna Lay","dmEmail":"dlay@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"AAA Secure RV","code":"L364","state":"CA","managerName":"Teresa Muniaerts","managerEmail":"manager@aaasecurervstorage.com","dmName":"Donna Lay","dmEmail":"dlay@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Bend Sentry Storage","code":"L394","state":"OR","managerName":"Gary Torkelson","managerEmail":"manager@bendsentrystorage.com","dmName":"Cliff Lewis","dmEmail":"Clewis@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Albany Self Stor","code":"L178","state":"OR","managerName":"Donna Hunsaker","managerEmail":"albanyselfstor@albanystorages.com","dmName":"Cliff Lewis","dmEmail":"Clewis@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"Albany Secure Storage","code":"L179","state":"OR","managerName":"Chris Doremus","managerEmail":"albanysecurestorage@albanystorages.com","dmName":"Cliff Lewis","dmEmail":"Clewis@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"},{"name":"U Store It - Deming","code":"L034","state":"NM","managerName":"Guadalupe Torres","managerEmail":"manager@demingselfstorage.com","dmName":"Jasmine Rivera","dmEmail":"jrivera@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"U Store It - Las Cruces","code":"L038","state":"NM","managerName":"Mayra Lozano","managerEmail":"manager@ustoreitlascruces.com","dmName":"Jasmine Rivera","dmEmail":"jrivera@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"U Store It - Silver City","code":"L037","state":"NM","managerName":"Ed Alvo","managerEmail":"manager@silvercityselfstorage.com","dmName":"Jasmine Rivera","dmEmail":"jrivera@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"Roadrunner Self Storage","code":"L064","state":"NM","managerName":"Maria Armendariz","managerEmail":"manager@roadrunnerselfstoragelc.com","dmName":"Jasmine Rivera","dmEmail":"jrivera@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"South Main Self Storage","code":"L063","state":"NM","managerName":"Cristina Lopez","managerEmail":"manager@southmainselfstorage.com","dmName":"Jasmine Rivera","dmEmail":"jrivera@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"Lohman Self Storage","code":"L067","state":"NM","managerName":"Sarai Jimenez","managerEmail":"manager@lohmanselfstorage.com","dmName":"Jasmine Rivera","dmEmail":"jrivera@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"Hwy 70 Self Storage","code":"L062","state":"NM","managerName":"Michael Gonzalez","managerEmail":"manager@highway70selfstorage.com","dmName":"Jasmine Rivera","dmEmail":"jrivera@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"2nd Street Self Storage","code":"L395","state":"NM","managerName":"Krystal Palma","managerEmail":"manager@2ndstreetselfstorage.com","dmName":"Jasmine Rivera","dmEmail":"jrivera@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"Las Alturas Self Storage","code":"L410","state":"NM","managerName":"Leslie Torres","managerEmail":"manager@lasalturasselfstorage.com","dmName":"Jasmine Rivera","dmEmail":"jrivera@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"Sunset Self Storage","code":"L388","state":"NM","managerName":"Deja Riddle","managerEmail":"manager@sunsetstorageroswell.com","dmName":"Jasmine Rivera","dmEmail":"jrivera@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"Telshor Self Storage","code":"L065","state":"NM","managerName":"Ivonne Telles","managerEmail":"manager@telshorselfstorage.com","dmName":"Jasmine Rivera","dmEmail":"jrivera@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"U Store It - Truth or Consequences","code":"L035","state":"NM","managerName":"Teri Graham","managerEmail":"manager@torcselfstorage.com","dmName":"Jasmine Rivera","dmEmail":"jrivera@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"I-25 Self Storage","code":"L243","state":"NM","managerName":"Laura Arias","managerEmail":"manager@selfstoragei25.com","dmName":"Jasmine Rivera","dmEmail":"jrivera@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"Climate Self Storage-Rinconada","code":"L439","state":"NM","managerName":"Sierra Riggs","managerEmail":"rinconada@climateselfstorage.com","dmName":"Jasmine Rivera","dmEmail":"jrivera@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"AAA King Self Storage","code":"L108","state":"CO","managerName":"Maria and Benjamin","managerEmail":"manager@aaakingstorage.com","dmName":"Ken Lanier","dmEmail":"klanier@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Red Rocks Self Storage - White Diamond","code":"L432","state":"CO","managerName":"Jacob Hermansen","managerEmail":"whitediamond@redrocksstoragecolorado.com","dmName":"Ken Lanier","dmEmail":"klanier@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Red Rocks Self Storage - Aurora","code":"L434","state":"CO","managerName":"MOD/Manager On Duty","managerEmail":"aurora@redrocksstoragecolorado.com","dmName":"Ken Lanier","dmEmail":"klanier@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Buffalo Run Self Storage","code":"L091","state":"CO","managerName":"Maria Alvarado","managerEmail":"manager@buffalorunselfstorage.com","dmName":"Ken Lanier","dmEmail":"klanier@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Red Rocks Self Storage - Chardonnay","code":"L431","state":"CO","managerName":"Brian Payne","managerEmail":"chardonnay@redrocksstoragecolorado.com","dmName":"Ken Lanier","dmEmail":"klanier@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"BOXIT Storage Centers","code":"L408","state":"MO","managerName":"Mary Louis","managerEmail":"manager@boxitstoragecenters.com","dmName":"Kristi Graham","dmEmail":"kgraham@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"Sure Thing! Self Storage - Toledo","code":"L409","state":"OH","managerName":"Jason Donham","managerEmail":"manager@surethingstoragetoledo.com","dmName":"Kristi Graham","dmEmail":"kgraham@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"81st & Union Self Storage","code":"L385","state":"OK","managerName":"Jesus Padilla","managerEmail":"manager@81standunionstorage.com","dmName":"Kristi Graham","dmEmail":"kgraham@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"Bryan Street Storage","code":"L414","state":"OK","managerName":"Shawn Stiltz","managerEmail":"manager@bryanstreetstorage.com","dmName":"Kristi Graham","dmEmail":"kgraham@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"Independence Street Storage","code":"L415","state":"OK","managerName":"Shawn Stiltz","managerEmail":"manager@independenceststorage.com","dmName":"Kristi Graham","dmEmail":"kgraham@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"Real Storage - Dallas","code":"L375","state":"TX","managerName":"Kenneth Overton","managerEmail":"manager@realstoragedallas.com","dmName":"Kristi Graham","dmEmail":"kgraham@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"Real Storage - Plano","code":"L376","state":"TX","managerName":"Crystal Walker","managerEmail":"manager@realstorageplano.com","dmName":"Kristi Graham","dmEmail":"kgraham@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"South Collins Mini & RV Storage","code":"L369","state":"TX","managerName":"Michael Shotwell","managerEmail":"manager@southcollinsselfstorage.com","dmName":"Kristi Graham","dmEmail":"kgraham@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"A Armadillo Self Storage","code":"L368","state":"TX","managerName":"Morgan Chaisson","managerEmail":"manager@aarmadilloselfstorage.com","dmName":"Kristi Graham","dmEmail":"kgraham@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"Western Mass Storage Solutions","code":"L233","state":"MA","managerName":"Keith Kapise","managerEmail":"Manager@westernmassstoragesolutions.com","dmName":"Lee Anne Sladeski","dmEmail":"lsladeski@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Thirty Pines Self Storage","code":"L245","state":"NH","managerName":"Lindsay Norling","managerEmail":"Manager@thirtypinesselfstorage.com","dmName":"Lee Anne Sladeski","dmEmail":"lsladeski@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Storage Station","code":"L256","state":"NH","managerName":"Aryannah Laudani","managerEmail":"Manager@storagestationnh.com","dmName":"Lee Anne Sladeski","dmEmail":"lsladeski@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Watertown Storage Solutions (Water St)","code":"L430","state":"NY","managerName":"Edward Richardson","managerEmail":"waterstreet@watertownstoragesolutions.com","dmName":"Lee Anne Sladeski","dmEmail":"lsladeski@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Watertown Storage Solutions (Rt 11)","code":"L427","state":"NY","managerName":"Edward Richardson","managerEmail":"us11@watertownstoragesolutions.com","dmName":"Lee Anne Sladeski","dmEmail":"lsladeski@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Watertown Storage Solutions (RT 37)","code":"L429","state":"NY","managerName":"Edward Richardson","managerEmail":"ny37@watertownstoragesolutions.com","dmName":"Lee Anne Sladeski","dmEmail":"lsladeski@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Watertown Storage Solutions (Rt 283)","code":"L428","state":"NY","managerName":"Edward Richardson","managerEmail":"ny283@watertownstoragesolutions.com","dmName":"Lee Anne Sladeski","dmEmail":"lsladeski@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Watertown Storage Solutions (Gardnerville Rd)","code":"L426","state":"NY","managerName":"Edward Richardson","managerEmail":"gardnervilleroad@watertownstoragesolutions.com","dmName":"Lee Anne Sladeski","dmEmail":"lsladeski@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Dayville Self Storage","code":"L362","state":"CT","managerName":"Amy Keeling","managerEmail":"Dayville@storagenortheastct.com","dmName":"LeeAnne Sladeski","dmEmail":"lsladeski@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Mechanic Street Self Storage","code":"L360","state":"CT","managerName":"Amy Keeling","managerEmail":"Mechanic@storagenortheastct.com","dmName":"LeeAnne Sladeski","dmEmail":"lsladeski@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Brooklyn Self Storage","code":"L361","state":"CT","managerName":"Amy Keeling","managerEmail":"Brooklyn@storagenortheastct.com","dmName":"LeeAnne Sladeski","dmEmail":"lsladeski@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"North Andover Self Storage","code":"L306","state":"MA","managerName":"Michael Cemach","managerEmail":"manager@northandoverselfstorage.com","dmName":"LeeAnne Sladeski","dmEmail":"lsladeski@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Mulberry Storage Center","code":"L357","state":"CO","managerName":"Andrew Wilkins","managerEmail":"manager@mulberrystoragecenter.com","dmName":"Matt Vestal","dmEmail":"mvestal@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"New Frontier Bennett","code":"L106","state":"CO","managerName":"Mindi Sewell","managerEmail":"bennett@newfrontierselfstorage.com","dmName":"Matt Vestal","dmEmail":"mvestal@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"New Frontier Gypsum","code":"L094","state":"CO","managerName":"Bridget Bradford","managerEmail":"lindbergh@newfrontierselfstorage.com","dmName":"Matt Vestal","dmEmail":"mvestal@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Eastside Self Storage","code":"L269","state":"CO","managerName":"Shane Misialek","managerEmail":"manager@eastsideselfstorage.biz","dmName":"Matt Vestal","dmEmail":"mvestal@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Crossroads Self Storage","code":"L014","state":"CO","managerName":"Jake Ward","managerEmail":"manager@crossroadsselfstore.com","dmName":"Matt Vestal","dmEmail":"mvestal@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Waterglen Self Storage","code":"L302","state":"CO","managerName":"Corey Ellison","managerEmail":"manager@selfstoragewaterglen.com","dmName":"Matt Vestal","dmEmail":"mvestal@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"New Frontier Laurel","code":"L339","state":"MT","managerName":"Candace Dubois","managerEmail":"mainstreet@newfrontierselfstorage.com","dmName":"Matt Vestal","dmEmail":"mvestal@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"New Frontier Billings","code":"L251","state":"MT","managerName":"Jill Carpenter","managerEmail":"billings@newfrontierselfstorage.com","dmName":"Matt Vestal","dmEmail":"mvestal@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Westbrook Storage","code":"L235","state":"MT","managerName":"Courtney Anderson","managerEmail":"manager@westbrookselfstorage.com","dmName":"Matt Vestal","dmEmail":"mvestal@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Open Range Storage","code":"L383","state":"WY","managerName":"Natalia Mendez","managerEmail":"manager@openrangestorage.com","dmName":"Matt Vestal","dmEmail":"mvestal@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"New Frontier Southwest","code":"L317","state":"WY","managerName":"Scott Culp","managerEmail":"southwest@newfrontierselfstorage.com","dmName":"Matt Vestal","dmEmail":"mvestal@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"New Frontier Laramie","code":"L182","state":"WY","managerName":"Dianna Strannigan","managerEmail":"laramie@newfrontierselfstorage.com","dmName":"Matt Vestal","dmEmail":"mvestal@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Finfeather Storage","code":"L336","state":"TX","managerName":"Cheryl Sheffield","managerEmail":"manager@finfeatherstorage.com","dmName":"Melissa Wells","dmEmail":"mwells@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"Georgetown Mini Storage","code":"L392","state":"TX","managerName":"Mary Louis","managerEmail":"manager@georgetownministorage.com","dmName":"Melissa Wells","dmEmail":"mwells@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"Finfeather Industrial Park & Storage","code":"L335","state":"TX","managerName":"Cheryl Sheffield","managerEmail":"finfeatherstorage@gmail.com","dmName":"Melissa Wells","dmEmail":"mwells@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"U Store It - Arlington","code":"L044","state":"TX","managerName":"TBD","managerEmail":"manager@ustoreitarlington.com","dmName":"Melissa Wells","dmEmail":"mwells@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"U Store It - Mesquite","code":"L043","state":"TX","managerName":"Crystella Espinoza","managerEmail":"manager@ustoreitmesquite.com","dmName":"Melissa Wells","dmEmail":"mwells@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"U Store It - Forest Hill","code":"L045","state":"TX","managerName":"Liz Slider","managerEmail":"manager@ustoreitforesthill.com","dmName":"Melissa Wells","dmEmail":"mwells@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"U Store It - Fort Worth","code":"L047","state":"TX","managerName":"Becky Ross","managerEmail":"manager@ustoreitfortworth.com","dmName":"Melissa Wells","dmEmail":"mwells@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"Manvel Self Storage","code":"L405","state":"TX","managerName":"Crystal Smith","managerEmail":"manager@manvelselfstorage.com","dmName":"Melissa Wells","dmEmail":"mwells@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"New Frontier Self Storage - Pine Bluff","code":"L222","state":"AR","managerName":"Natasha Adams","managerEmail":"pinebluff@newfrontierselfstorage.com","dmName":"Patrick Connell","dmEmail":"pconnell@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"New Frontier Self Storage - Conway","code":"L297","state":"AR","managerName":"Roberto Sauceda","managerEmail":"conway@newfrontierselfstorage.com","dmName":"Patrick Connell","dmEmail":"pconnell@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"Superior Self Storage","code":"L107","state":"TX","managerName":"Dennis Bruggner","managerEmail":"manager@superiorselfstore.com","dmName":"Patrick Connell","dmEmail":"pconnell@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"U Store It - Amarillo 2328","code":"L030","state":"TX","managerName":"TBD","managerEmail":"manager@ustoreitamarillo.com","dmName":"Patrick Connell","dmEmail":"pconnell@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"Aardvark Self Storage","code":"L053","state":"TX","managerName":"TBD","managerEmail":"manager@aardvarkselfstoragefw.com","dmName":"Patrick Connell","dmEmail":"pconnell@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"U Store It - Amarillo 33rd Ave","code":"L031","state":"TX","managerName":"Tamra Foster","managerEmail":"ustoreit6715@gmail.com","dmName":"Patrick Connell","dmEmail":"pconnell@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"U Store It - Amarillo 6715","code":"L029","state":"TX","managerName":"Tamra Foster","managerEmail":"ustoreit6715@ustoreitamarillo.com","dmName":"Patrick Connell","dmEmail":"pconnell@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"Addison Circle Storage","code":"L433","state":"TX","managerName":"Jake Cook","managerEmail":"manager@addisoncirclestorage.com","dmName":"Patrick Connell","dmEmail":"pconnell@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"Country Club Self Storage","code":"L066","state":"NM","managerName":"Cynthia Arias","managerEmail":"manager@countryclubselfstoragenm.com","dmName":"Ruben Jurado","dmEmail":"rjurado@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"Pellicano Self Storage","code":"L300","state":"TX","managerName":"Rachel Cazares","managerEmail":"manager@pellicanoselfstorage.com","dmName":"Ruben Jurado","dmEmail":"rjurado@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"Hwy 54 Self Storage","code":"L128","state":"TX","managerName":"Alexandra Gallardo","managerEmail":"manager@hwy54selfstorage.com","dmName":"Ruben Jurado","dmEmail":"rjurado@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"Las Tierras Self Storage","code":"L130","state":"TX","managerName":"Mariana Cerdas","managerEmail":"manager@lastierrasselfstorage.com","dmName":"Ruben Jurado","dmEmail":"rjurado@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"Patriot Fwy Self Storage","code":"L129","state":"TX","managerName":"Esmeralda Juarez","managerEmail":"manager@patriotfwyselfstorage.com","dmName":"Ruben Jurado","dmEmail":"rjurado@arguspsm.com","rdName":"Ruben Jurado","rdEmail":"rjurado@arguspsm.com"},{"name":"New Frontier Self Storage - Siloam Springs","code":"L273","state":"AR","managerName":"Cheryl Whitcomb","managerEmail":"siloamsprings@newfrontierselfstorage.com","dmName":"Sabra Mars","dmEmail":"smars@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"New Frontier Self Storage - Hot Springs","code":"L228","state":"AR","managerName":"Jasmine Jones","managerEmail":"hotsprings@newfrontierselfstorage.com","dmName":"Sabra Mars","dmEmail":"smars@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"New Frontier Self Storage - Hot Springs Village","code":"L227","state":"AR","managerName":"Amanda Johnson","managerEmail":"hotspringsvillage@newfrontierselfstorage.com","dmName":"Sabra Mars","dmEmail":"smars@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"U Store It - Fort Smith 4011","code":"L032","state":"AR","managerName":"Rebecca Yarbrough","managerEmail":"manager@ustoreitfortsmith.com","dmName":"Sabra Mars","dmEmail":"smars@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"AAA Self Storage - Fort Smith Grand Ave","code":"L214","state":"AR","managerName":"Nicholas Pfeiler","managerEmail":"grandave@aaastoragear.com","dmName":"Sabra Mars","dmEmail":"smars@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"U Store It - Fort Smith 5808","code":"L033","state":"AR","managerName":"Rebecca Yarbrough","managerEmail":"manager@ustoreitfortsmith.com","dmName":"Sabra Mars","dmEmail":"smars@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"AAA Self Storage - Fort Smith","code":"L213","state":"AR","managerName":"Sabra Mars","managerEmail":"58thstreet@aaastoragear.com","dmName":"Sabra Mars","dmEmail":"smars@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"Hot Springs RV & Self Storage","code":"L363","state":"AR","managerName":"Mary Jirtle","managerEmail":"manager@hotspringsrvandstorage.com","dmName":"Sabra Mars","dmEmail":"smars@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"Hot Springs Self Storage","code":"L404","state":"AR","managerName":"Stephanie Stevens","managerEmail":"manager@hotspringsselfstorage.com","dmName":"Sabra Mars","dmEmail":"smars@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"Tri-Village Self Storage - Louisville","code":"L114","state":"KY","managerName":"Laura Beardwell","managerEmail":"manager@selfstoragekentucky.com","dmName":"Sabra Mars","dmEmail":"smars@arguspsm.com","rdName":"Joe Razo","rdEmail":"jrazo@arguspsm.com"},{"name":"Oxford Storage","code":"L384","state":"FL","managerName":"Alexa Gosby","managerEmail":"manager@oxfordfloridastorage.com","dmName":"Sara Thompson","dmEmail":"sthompson@arguspsm.com","rdName":"David Vivancos","rdEmail":"dvivancos@arguspsm.com"},{"name":"Riverside Storage","code":"L311","state":"GA","managerName":"TBD","managerEmail":"manager@riversideselfstorage.com","dmName":"Sara Thompson","dmEmail":"sthompson@arguspsm.com","rdName":"David Vivancos","rdEmail":"dvivancos@arguspsm.com"},{"name":"Your Space Self Store - Tavares","code":"L422","state":"FL","managerName":"Shane Huckeba","managerEmail":"tavares@yourspaceselfstore.com","dmName":"Sara Thompson","dmEmail":"sthompson@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Your Space Self Store - Summerfield","code":"L423","state":"FL","managerName":"Debra Crocco","managerEmail":"summerfield@yourspaceselfstore.com","dmName":"Sara Thompson","dmEmail":"sthompson@arguspsm.com","rdName":"Kyla Cole","rdEmail":"Kcole@arguspsm.com"},{"name":"Ray Self Storage - Church St.","code":"L330","state":"NC","managerName":"Karen Chaney","managerEmail":"raymini@rayselfstorage.com","dmName":"Tamatha Smith","dmEmail":"tsmith@arguspsm.com","rdName":"David Vivancos","rdEmail":"dvivancos@arguspsm.com"},{"name":"Ray Self Storage - Norwalk St","code":"L329","state":"NC","managerName":"Devin Houser","managerEmail":"rssn@rayselfstorage.com","dmName":"Tamatha Smith","dmEmail":"tsmith@arguspsm.com","rdName":"David Vivancos","rdEmail":"dvivancos@arguspsm.com"},{"name":"Ray Self Storage - Spring Garden","code":"L327","state":"NC","managerName":"Angelika Phoenix","managerEmail":"rsssp@rayselfstorage.com","dmName":"Tamatha Smith","dmEmail":"tsmith@arguspsm.com","rdName":"David Vivancos","rdEmail":"dvivancos@arguspsm.com"},{"name":"Ray Self Storage - Gate City","code":"L328","state":"NC","managerName":"Martha Mitchell","managerEmail":"rssg@rayselfstorage.com","dmName":"Tamatha Smith","dmEmail":"tsmith@arguspsm.com","rdName":"David Vivancos","rdEmail":"dvivancos@arguspsm.com"},{"name":"Tempe Choice Self Storage","code":"L024","state":"AZ","managerName":"Lisa Gerlach","managerEmail":"manager@tempechoicestorage.com","dmName":"Alyssa Rios","dmEmail":"arios@arguspsm.com","rdName":"Donna Lay","rdEmail":"dlay@arguspsm.com"}];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const addDays = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};
const today = () => new Date().toISOString().split("T")[0];
const daysBetween = (a, b) => Math.floor((new Date(b) - new Date(a)) / 86400000);
const formatDate = (d) => d ? new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const getStatus = (unit) => {
  if (!unit.letter1_date) return "PENDING";
  if (!unit.letter2_date) {
    const daysSince1 = daysBetween(unit.letter1_date, today());
    if (daysSince1 < 32) return "AWAITING_L2_EARLY";
    return "AWAITING_L2";
  }
  if (!unit.dm_approved) {
    const daysSince2 = daysBetween(unit.letter2_date, today());
    if (daysSince2 < 32) return "AWAITING_SIGNOFF_EARLY";
    return "AWAITING_SIGNOFF";
  }
  return "APPROVED";
};

const STATUS_CONFIG = {
  PENDING: { label: "No Letter Sent", color: "#6b7280", bg: "#f3f4f6", dot: "#9ca3af" },
  AWAITING_L2_EARLY: { label: "L1 Sent — Waiting", color: "#92400e", bg: "#fef3c7", dot: "#f59e0b" },
  AWAITING_L2: { label: "Send Letter 2 Now", color: "#7c2d12", bg: "#fef2f2", dot: "#ef4444" },
  AWAITING_SIGNOFF_EARLY: { label: "L2 Sent — Waiting", color: "#1e3a5f", bg: "#eff6ff", dot: "#3b82f6" },
  AWAITING_SIGNOFF: { label: "DM Sign-Off Required", color: "#4c1d95", bg: "#f5f3ff", dot: "#8b5cf6" },
  APPROVED: { label: "Ready for Lien", color: "#064e3b", bg: "#ecfdf5", dot: "#10b981" },
};

// Hard-coded users (no DB needed for auth)
const buildDefaultUsers = () => {
  const users = [{ id: "l2l_admin", email: "andy@late2lien.net", name: "Andy (L2L Admin)", role: "admin", password: "admin123", facilities: "ALL" }];
  const dmMap = {};
  FACILITIES_DATA.forEach(f => {
    const key = f.dmEmail.toLowerCase();
    if (!dmMap[key]) dmMap[key] = { id: `dm_${key}`, email: f.dmEmail, name: f.dmName, role: "dm", password: "argus2024", facilities: [] };
    dmMap[key].facilities.push(f.code);
  });
  Object.values(dmMap).forEach(dm => users.push(dm));
  const mgMap = {};
  FACILITIES_DATA.forEach(f => {
    const key = f.managerEmail.toLowerCase();
    if (!mgMap[key]) mgMap[key] = { id: `mg_${key}`, email: f.managerEmail, name: f.managerName || f.managerEmail, role: "manager", password: "argus2024", facilities: [] };
    if (!mgMap[key].facilities.includes(f.code)) mgMap[key].facilities.push(f.code);
  });
  Object.values(mgMap).forEach(mg => users.push(mg));
  return users;
};

const ALL_USERS = buildDefaultUsers();

// ─── EXCEL EXPORT ────────────────────────────────────────────────────────────
const exportToExcel = (units, facilities) => {
  const getFac = (code) => facilities.find(f => f.code === code);

  const buckets = [
    { label: "1 - No Letter Sent", statuses: ["PENDING"] },
    { label: "2 - Letter 1 In Progress", statuses: ["AWAITING_L2_EARLY"] },
    { label: "3 - Send Letter 2 Now", statuses: ["AWAITING_L2"] },
    { label: "4 - Awaiting DM Approval", statuses: ["AWAITING_SIGNOFF_EARLY", "AWAITING_SIGNOFF"] },
    { label: "5 - Approved / Ready for Lien", statuses: ["APPROVED"] },
  ];

  const headers = [
    "Stage", "Facility Code", "Facility Name", "State", "Unit Number",
    "Status", "Notes", "Letter 1 Date", "Letter 1 Logged By",
    "Letter 2 Date", "Letter 2 Logged By",
    "DM Approved", "DM Approved At", "DM Approved By",
    "DM Name", "DM Email", "Manager Name", "Manager Email",
    "RD Name", "RD Email", "Added By", "Created At"
  ];

  const rows = [];
  buckets.forEach(bucket => {
    const bucketUnits = units.filter(u => bucket.statuses.includes(getStatus(u)));
    bucketUnits.forEach(u => {
      const fac = getFac(u.facility_code) || {};
      rows.push([
        bucket.label,
        u.facility_code || "",
        u.facility_name || "",
        fac.state || "",
        u.unit_number || "",
        STATUS_CONFIG[getStatus(u)]?.label || "",
        u.note || "",
        u.letter1_date || "",
        u.letter1_logged_by || "",
        u.letter2_date || "",
        u.letter2_logged_by || "",
        u.dm_approved ? "Yes" : "No",
        u.dm_approved_at ? u.dm_approved_at.split("T")[0] : "",
        u.dm_approved_by || "",
        fac.dmName || "",
        fac.dmEmail || "",
        fac.managerName || "",
        fac.managerEmail || "",
        fac.rdName || "",
        fac.rdEmail || "",
        u.added_by || "",
        u.created_at ? u.created_at.split("T")[0] : "",
      ]);
    });
  });

  // Build CSV
  const escape = (v) => {
    const s = String(v);
    if (s.includes(",") || s.includes('"') || s.includes("\n")) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const csv = [headers, ...rows].map(row => row.map(escape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `argus-no-lease-${today()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, background: cfg.bg, color: cfg.color, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
      {cfg.label}
    </span>
  );
};

const Modal = ({ title, onClose, children }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
    <div style={{ background: "#fff", borderRadius: 12, width: "100%", maxWidth: 520, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>{title}</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#6b7280", lineHeight: 1 }}>×</button>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  </div>
);

const Field = ({ label, children, hint }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 5 }}>{label}</label>
    {children}
    {hint && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6b7280" }}>{hint}</p>}
  </div>
);

const Input = (props) => (
  <input {...props} style={{ width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: 7, fontSize: 14, outline: "none", boxSizing: "border-box", ...props.style }} />
);

const Btn = ({ children, onClick, variant = "primary", small, disabled, style: s }) => {
  const styles = {
    primary: { background: "#1e40af", color: "#fff", border: "none" },
    secondary: { background: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db" },
    danger: { background: "#dc2626", color: "#fff", border: "none" },
    success: { background: "#059669", color: "#fff", border: "none" },
    ghost: { background: "transparent", color: "#6b7280", border: "1px solid #e5e7eb" },
    export: { background: "#0f766e", color: "#fff", border: "none" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ padding: small ? "6px 12px" : "9px 18px", borderRadius: 7, fontSize: small ? 12 : 14, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, ...styles[variant], ...s }}>
      {children}
    </button>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState("dashboard");
  const [modal, setModal] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterFacility, setFilterFacility] = useState("ALL");
  const [searchQ, setSearchQ] = useState("");
  const [toast, setToast] = useState(null);
  const [dbError, setDbError] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadUnits = async () => {
    try {
      const data = await sb("units?order=created_at.desc");
      setUnits(data);
      setDbError(false);
    } catch (e) {
      console.error("Supabase load error:", e);
      setDbError(true);
    }
    setLoading(false);
  };

  useEffect(() => { loadUnits(); }, []);

  const login = () => {
    const u = ALL_USERS.find(x => x.email.toLowerCase() === loginEmail.toLowerCase() && x.password === loginPass);
    if (!u) { setLoginErr("Invalid email or password."); return; }
    setCurrentUser(u);
    setLoginErr("");
  };

  const logout = () => { setCurrentUser(null); setView("dashboard"); };

  const myFacilities = currentUser
    ? currentUser.role === "admin"
      ? FACILITIES_DATA
      : FACILITIES_DATA.filter(f => (currentUser.facilities || []).some(fc => fc.toLowerCase() === f.code.toLowerCase()))
    : [];

  const myFacilityCodes = new Set(myFacilities.map(f => f.code));
  const myUnits = units.filter(u => myFacilityCodes.has(u.facility_code));

  const getFacility = (code) => FACILITIES_DATA.find(f => f.code === code);

  const filteredUnits = myUnits.filter(u => {
    const status = getStatus(u);
    if (filterStatus !== "ALL" && status !== filterStatus) return false;
    if (filterFacility !== "ALL" && u.facility_code !== filterFacility) return false;
    if (searchQ) {
      const q = searchQ.toLowerCase();
      if (!u.unit_number.toLowerCase().includes(q) && !u.facility_name.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const stats = {
    total: myUnits.length,
    pending: myUnits.filter(u => getStatus(u) === "PENDING").length,
    needL2: myUnits.filter(u => getStatus(u) === "AWAITING_L2").length,
    needSignoff: myUnits.filter(u => getStatus(u) === "AWAITING_SIGNOFF").length,
    approved: myUnits.filter(u => getStatus(u) === "APPROVED").length,
  };

  // ── UNIT ACTIONS ──
  const addUnit = async (data) => {
    const fac = getFacility(data.facilityCode);
    if (!fac) return;
    setSaving(true);
    try {
      const result = await sb("units", {
        method: "POST",
        body: JSON.stringify({
          facility_code: fac.code,
          facility_name: fac.name,
          unit_number: data.unitName.trim(),
          note: data.note.trim(),
          added_by: currentUser.email,
        }),
      });
      setUnits(prev => [result[0], ...prev]);
      showToast(`Unit ${data.unitName} added to ${fac.name}`);
      setModal(null);
    } catch (e) {
      showToast("Error saving unit. Check database connection.", "error");
    }
    setSaving(false);
  };

  const updateUnit = async (id, fields) => {
    setSaving(true);
    try {
      await sb(`units?id=eq.${id}`, {
        method: "PATCH",
        body: JSON.stringify(fields),
      });
      setUnits(prev => prev.map(u => u.id === id ? { ...u, ...fields } : u));
    } catch (e) {
      showToast("Error updating unit. Check database connection.", "error");
    }
    setSaving(false);
  };

  const logLetter1 = async (unit, date) => {
    await updateUnit(unit.id, { letter1_date: date, letter1_logged_by: currentUser.email, status: "awaiting_l2" });
    showToast("Letter 1 date saved.");
    setModal(null);
  };

  const logLetter2 = async (unit, date) => {
    if (daysBetween(unit.letter1_date, date) < 32) {
      showToast("ERROR: Letter 2 sent too early. Must be at least 32 days after Letter 1.", "error");
      return;
    }
    await updateUnit(unit.id, { letter2_date: date, letter2_logged_by: currentUser.email, status: "awaiting_signoff" });
    showToast("Letter 2 logged. DM sign-off required.");
    setModal(null);
  };

  const dmSignoff = async (unit, confirmed) => {
    if (!confirmed) return;
    await updateUnit(unit.id, {
      dm_approved: true,
      dm_approved_at: new Date().toISOString(),
      dm_approved_by: currentUser.email,
      status: "approved",
    });
    showToast("Sign-off complete. Unit approved for lien process.");
    setModal(null);
  };

  const deleteUnit = async (id) => {
    setSaving(true);
    try {
      await sb(`units?id=eq.${id}`, { method: "DELETE", prefer: "return=minimal" });
      setUnits(prev => prev.filter(u => u.id !== id));
      showToast("Unit removed.");
      setModal(null);
    } catch (e) {
      showToast("Error deleting unit.", "error");
    }
    setSaving(false);
  };

  // ── PRELOAD UNITS (admin only) ──
  const PRELOAD_UNITS = [{"facility_code":"L168","facility_name":"24-7 Automated Storage","unit_number":"096"},{"facility_code":"L168","facility_name":"24-7 Automated Storage","unit_number":"195"},{"facility_code":"L168","facility_name":"24-7 Automated Storage","unit_number":"197"},{"facility_code":"L266","facility_name":"303 Self Storage Rino","unit_number":"344"},{"facility_code":"L266","facility_name":"303 Self Storage Rino","unit_number":"40"},{"facility_code":"L266","facility_name":"303 Self Storage Rino","unit_number":"445"},{"facility_code":"L266","facility_name":"303 Self Storage Rino","unit_number":"488"},{"facility_code":"L266","facility_name":"303 Self Storage Rino","unit_number":"522"},{"facility_code":"L400","facility_name":"Aardvark Self Storage","unit_number":"B193"},{"facility_code":"L400","facility_name":"Aardvark Self Storage","unit_number":"E031"},{"facility_code":"L027","facility_name":"A-Secured RV & Vehicle Storage","unit_number":"J130"},{"facility_code":"L027","facility_name":"A-Secured RV & Vehicle Storage","unit_number":"M116"},{"facility_code":"L053","facility_name":"Aardvark Self Storage","unit_number":"B003"},{"facility_code":"L085","facility_name":"Alpha Self Storage","unit_number":"RV005"},{"facility_code":"L225","facility_name":"American Self Storage - Wilmot","unit_number":"0101"},{"facility_code":"L225","facility_name":"American Self Storage - Wilmot","unit_number":"0430"},{"facility_code":"L225","facility_name":"American Self Storage - Wilmot","unit_number":"0556"},{"facility_code":"L298","facility_name":"Belmont Self Storage","unit_number":"G35"},{"facility_code":"L298","facility_name":"Belmont Self Storage","unit_number":"R05"},{"facility_code":"L298","facility_name":"Belmont Self Storage","unit_number":"U17"},{"facility_code":"L394","facility_name":"Bend Sentry Storage","unit_number":"00071"},{"facility_code":"L394","facility_name":"Bend Sentry Storage","unit_number":"00183"},{"facility_code":"L394","facility_name":"Bend Sentry Storage","unit_number":"00437"},{"facility_code":"L394","facility_name":"Bend Sentry Storage","unit_number":"00438"},{"facility_code":"L394","facility_name":"Bend Sentry Storage","unit_number":"00480"},{"facility_code":"L394","facility_name":"Bend Sentry Storage","unit_number":"00490"},{"facility_code":"L394","facility_name":"Bend Sentry Storage","unit_number":"13966"},{"facility_code":"L394","facility_name":"Bend Sentry Storage","unit_number":"50419"},{"facility_code":"L195","facility_name":"Boulder Storage Center","unit_number":"612"},{"facility_code":"L361","facility_name":"Brooklyn Self Storage","unit_number":"104"},{"facility_code":"L361","facility_name":"Brooklyn Self Storage","unit_number":"107"},{"facility_code":"L361","facility_name":"Brooklyn Self Storage","unit_number":"131"},{"facility_code":"L361","facility_name":"Brooklyn Self Storage","unit_number":"144"},{"facility_code":"L361","facility_name":"Brooklyn Self Storage","unit_number":"30"},{"facility_code":"L361","facility_name":"Brooklyn Self Storage","unit_number":"68"},{"facility_code":"L361","facility_name":"Brooklyn Self Storage","unit_number":"88"},{"facility_code":"L361","facility_name":"Brooklyn Self Storage","unit_number":"94"},{"facility_code":"L361","facility_name":"Brooklyn Self Storage","unit_number":"95A"},{"facility_code":"L146","facility_name":"Casa Grande Self Storage","unit_number":"G01"},{"facility_code":"L230","facility_name":"Clover Basin Self Storage","unit_number":"1335"},{"facility_code":"L230","facility_name":"Clover Basin Self Storage","unit_number":"1337"},{"facility_code":"L230","facility_name":"Clover Basin Self Storage","unit_number":"1516"},{"facility_code":"L230","facility_name":"Clover Basin Self Storage","unit_number":"201"},{"facility_code":"L230","facility_name":"Clover Basin Self Storage","unit_number":"745"},{"facility_code":"L230","facility_name":"Clover Basin Self Storage","unit_number":"841"},{"facility_code":"L230","facility_name":"Clover Basin Self Storage","unit_number":"854"},{"facility_code":"L230","facility_name":"Clover Basin Self Storage","unit_number":"948"},{"facility_code":"L230","facility_name":"Clover Basin Self Storage","unit_number":"967"},{"facility_code":"L284","facility_name":"Continental Self Storage","unit_number":"F343A"},{"facility_code":"L362","facility_name":"Dayville Self Storage","unit_number":"A222"},{"facility_code":"L362","facility_name":"Dayville Self Storage","unit_number":"B102"},{"facility_code":"L362","facility_name":"Dayville Self Storage","unit_number":"B208"},{"facility_code":"L362","facility_name":"Dayville Self Storage","unit_number":"B216"},{"facility_code":"L362","facility_name":"Dayville Self Storage","unit_number":"C103"},{"facility_code":"L362","facility_name":"Dayville Self Storage","unit_number":"C124"},{"facility_code":"L362","facility_name":"Dayville Self Storage","unit_number":"C126"},{"facility_code":"L362","facility_name":"Dayville Self Storage","unit_number":"C141"},{"facility_code":"L362","facility_name":"Dayville Self Storage","unit_number":"D104"},{"facility_code":"L362","facility_name":"Dayville Self Storage","unit_number":"D128"},{"facility_code":"L362","facility_name":"Dayville Self Storage","unit_number":"D215"},{"facility_code":"L416","facility_name":"Dove Valley RV, Boat and Self Storage","unit_number":"031001"},{"facility_code":"L416","facility_name":"Dove Valley RV, Boat and Self Storage","unit_number":"031023"},{"facility_code":"L416","facility_name":"Dove Valley RV, Boat and Self Storage","unit_number":"EE24"},{"facility_code":"L416","facility_name":"Dove Valley RV, Boat and Self Storage","unit_number":"GG16"},{"facility_code":"L416","facility_name":"Dove Valley RV, Boat and Self Storage","unit_number":"JJ20"},{"facility_code":"L398","facility_name":"Fort Lowell Self Storage","unit_number":"B23"},{"facility_code":"L398","facility_name":"Fort Lowell Self Storage","unit_number":"E50"},{"facility_code":"L392","facility_name":"Georgetown Mini Storage","unit_number":"104"},{"facility_code":"L112","facility_name":"Highway 160 Self Storage","unit_number":"121"},{"facility_code":"L112","facility_name":"Highway 160 Self Storage","unit_number":"143"},{"facility_code":"L112","facility_name":"Highway 160 Self Storage","unit_number":"150"},{"facility_code":"L404","facility_name":"Hot Springs Self Storage","unit_number":"0283"},{"facility_code":"L243","facility_name":"I-25 Self Storage","unit_number":"588"},{"facility_code":"L307","facility_name":"L&L Mini Storage","unit_number":"021"},{"facility_code":"L307","facility_name":"L&L Mini Storage","unit_number":"103"},{"facility_code":"L307","facility_name":"L&L Mini Storage","unit_number":"PS27"},{"facility_code":"L410","facility_name":"Las Alturas Self Storage","unit_number":"B26"},{"facility_code":"L410","facility_name":"Las Alturas Self Storage","unit_number":"B31"},{"facility_code":"L410","facility_name":"Las Alturas Self Storage","unit_number":"C51"},{"facility_code":"L410","facility_name":"Las Alturas Self Storage","unit_number":"D38"},{"facility_code":"L410","facility_name":"Las Alturas Self Storage","unit_number":"E45"},{"facility_code":"L410","facility_name":"Las Alturas Self Storage","unit_number":"E54"},{"facility_code":"L410","facility_name":"Las Alturas Self Storage","unit_number":"E57"},{"facility_code":"L410","facility_name":"Las Alturas Self Storage","unit_number":"E73"},{"facility_code":"L097","facility_name":"Mary's Magazine Self Storage","unit_number":"019"},{"facility_code":"L097","facility_name":"Mary's Magazine Self Storage","unit_number":"420"},{"facility_code":"L097","facility_name":"Mary's Magazine Self Storage","unit_number":"B002"},{"facility_code":"L360","facility_name":"Mechanic Street Self Storage","unit_number":"220"},{"facility_code":"L360","facility_name":"Mechanic Street Self Storage","unit_number":"416"},{"facility_code":"L360","facility_name":"Mechanic Street Self Storage","unit_number":"608"},{"facility_code":"L360","facility_name":"Mechanic Street Self Storage","unit_number":"710"},{"facility_code":"L357","facility_name":"Mulberry Storage Center","unit_number":"C132"},{"facility_code":"L357","facility_name":"Mulberry Storage Center","unit_number":"E117"},{"facility_code":"L357","facility_name":"Mulberry Storage Center","unit_number":"E122"},{"facility_code":"L357","facility_name":"Mulberry Storage Center","unit_number":"E131"},{"facility_code":"L357","facility_name":"Mulberry Storage Center","unit_number":"G104"},{"facility_code":"L357","facility_name":"Mulberry Storage Center","unit_number":"J103"},{"facility_code":"L357","facility_name":"Mulberry Storage Center","unit_number":"K108"},{"facility_code":"L357","facility_name":"Mulberry Storage Center","unit_number":"M127"},{"facility_code":"L357","facility_name":"Mulberry Storage Center","unit_number":"R104"},{"facility_code":"L357","facility_name":"Mulberry Storage Center","unit_number":"S101"},{"facility_code":"L419","facility_name":"Nest Self Storage- Lafayette","unit_number":"151"},{"facility_code":"L419","facility_name":"Nest Self Storage- Lafayette","unit_number":"157"},{"facility_code":"L106","facility_name":"New Frontier Bennett","unit_number":"E105"},{"facility_code":"L106","facility_name":"New Frontier Bennett","unit_number":"J189"},{"facility_code":"L106","facility_name":"New Frontier Bennett","unit_number":"J194"},{"facility_code":"L106","facility_name":"New Frontier Bennett","unit_number":"J196"},{"facility_code":"L251","facility_name":"New Frontier Billings","unit_number":"036"},{"facility_code":"L251","facility_name":"New Frontier Billings","unit_number":"130"},{"facility_code":"L251","facility_name":"New Frontier Billings","unit_number":"541"},{"facility_code":"L251","facility_name":"New Frontier Billings","unit_number":"561"},{"facility_code":"L318","facility_name":"New Frontier College","unit_number":"B25"},{"facility_code":"L318","facility_name":"New Frontier College","unit_number":"C42"},{"facility_code":"L318","facility_name":"New Frontier College","unit_number":"CON031"},{"facility_code":"L318","facility_name":"New Frontier College","unit_number":"CON033"},{"facility_code":"L318","facility_name":"New Frontier College","unit_number":"D44"},{"facility_code":"L318","facility_name":"New Frontier College","unit_number":"H15"},{"facility_code":"L318","facility_name":"New Frontier College","unit_number":"H32"},{"facility_code":"L318","facility_name":"New Frontier College","unit_number":"H35"},{"facility_code":"L318","facility_name":"New Frontier College","unit_number":"I30"},{"facility_code":"L318","facility_name":"New Frontier College","unit_number":"I752"},{"facility_code":"L228","facility_name":"New Frontier Self Storage - Hot Springs","unit_number":"J0133"},{"facility_code":"L228","facility_name":"New Frontier Self Storage - Hot Springs","unit_number":"L0049"},{"facility_code":"L228","facility_name":"New Frontier Self Storage - Hot Springs","unit_number":"M0040"},{"facility_code":"L421","facility_name":"New Frontier Self Storage - Monument","unit_number":"D128"},{"facility_code":"L421","facility_name":"New Frontier Self Storage - Monument","unit_number":"G227"},{"facility_code":"L261","facility_name":"New Frontier Red Wing","unit_number":"0033"},{"facility_code":"L261","facility_name":"New Frontier Red Wing","unit_number":"0046"},{"facility_code":"L261","facility_name":"New Frontier Red Wing","unit_number":"0049"},{"facility_code":"L261","facility_name":"New Frontier Red Wing","unit_number":"0054"},{"facility_code":"L261","facility_name":"New Frontier Red Wing","unit_number":"0058"},{"facility_code":"L261","facility_name":"New Frontier Red Wing","unit_number":"0094"},{"facility_code":"L261","facility_name":"New Frontier Red Wing","unit_number":"0099"},{"facility_code":"L261","facility_name":"New Frontier Red Wing","unit_number":"0102"},{"facility_code":"L261","facility_name":"New Frontier Red Wing","unit_number":"0104"},{"facility_code":"L261","facility_name":"New Frontier Red Wing","unit_number":"0110"},{"facility_code":"L261","facility_name":"New Frontier Red Wing","unit_number":"0155"},{"facility_code":"L261","facility_name":"New Frontier Red Wing","unit_number":"0156"},{"facility_code":"L413","facility_name":"New Frontier Self Storage - Spokane Valley","unit_number":"0058"},{"facility_code":"L413","facility_name":"New Frontier Self Storage - Spokane Valley","unit_number":"0412"},{"facility_code":"L413","facility_name":"New Frontier Self Storage - Spokane Valley","unit_number":"0615"},{"facility_code":"L383","facility_name":"Open Range Storage","unit_number":"A13"},{"facility_code":"L330","facility_name":"Ray Self Storage - Church St.","unit_number":"B017"},{"facility_code":"L330","facility_name":"Ray Self Storage - Church St.","unit_number":"C024"},{"facility_code":"L330","facility_name":"Ray Self Storage - Church St.","unit_number":"CC156"},{"facility_code":"L330","facility_name":"Ray Self Storage - Church St.","unit_number":"E112"},{"facility_code":"L330","facility_name":"Ray Self Storage - Church St.","unit_number":"E115"},{"facility_code":"L330","facility_name":"Ray Self Storage - Church St.","unit_number":"EE246"},{"facility_code":"L330","facility_name":"Ray Self Storage - Church St.","unit_number":"H041"},{"facility_code":"L330","facility_name":"Ray Self Storage - Church St.","unit_number":"K019"},{"facility_code":"L330","facility_name":"Ray Self Storage - Church St.","unit_number":"L070"},{"facility_code":"L330","facility_name":"Ray Self Storage - Church St.","unit_number":"L127"},{"facility_code":"L330","facility_name":"Ray Self Storage - Church St.","unit_number":"N020"},{"facility_code":"L330","facility_name":"Ray Self Storage - Church St.","unit_number":"P008"},{"facility_code":"L330","facility_name":"Ray Self Storage - Church St.","unit_number":"T019"},{"facility_code":"L330","facility_name":"Ray Self Storage - Church St.","unit_number":"W015"},{"facility_code":"L328","facility_name":"Ray Self Storage - Gate City","unit_number":"A011"},{"facility_code":"L328","facility_name":"Ray Self Storage - Gate City","unit_number":"B009"},{"facility_code":"L328","facility_name":"Ray Self Storage - Gate City","unit_number":"E005"},{"facility_code":"L328","facility_name":"Ray Self Storage - Gate City","unit_number":"E011"},{"facility_code":"L328","facility_name":"Ray Self Storage - Gate City","unit_number":"F040"},{"facility_code":"L328","facility_name":"Ray Self Storage - Gate City","unit_number":"F117"},{"facility_code":"L327","facility_name":"Ray Self Storage - Spring Garden","unit_number":"904"},{"facility_code":"L434","facility_name":"Red Rocks Self Storage - Aurora","unit_number":"1000"},{"facility_code":"L434","facility_name":"Red Rocks Self Storage - Aurora","unit_number":"1049"},{"facility_code":"L434","facility_name":"Red Rocks Self Storage - Aurora","unit_number":"3067"},{"facility_code":"L434","facility_name":"Red Rocks Self Storage - Aurora","unit_number":"3082"},{"facility_code":"L434","facility_name":"Red Rocks Self Storage - Aurora","unit_number":"3094"},{"facility_code":"L434","facility_name":"Red Rocks Self Storage - Aurora","unit_number":"3128"},{"facility_code":"L434","facility_name":"Red Rocks Self Storage - Aurora","unit_number":"3129"},{"facility_code":"L434","facility_name":"Red Rocks Self Storage - Aurora","unit_number":"3157"},{"facility_code":"L434","facility_name":"Red Rocks Self Storage - Aurora","unit_number":"3169"},{"facility_code":"L434","facility_name":"Red Rocks Self Storage - Aurora","unit_number":"3193"},{"facility_code":"L431","facility_name":"Red Rocks Self Storage - Chardonnay","unit_number":"3000"},{"facility_code":"L057","facility_name":"Rita Ranch RV & Self Storage","unit_number":"A021"},{"facility_code":"L089","facility_name":"Sentry Storage- Elk Grove 2","unit_number":"00016"},{"facility_code":"L089","facility_name":"Sentry Storage- Elk Grove 2","unit_number":"00212"},{"facility_code":"L082","facility_name":"Sentry Storage Madison","unit_number":"00067"},{"facility_code":"L082","facility_name":"Sentry Storage Madison","unit_number":"00095"},{"facility_code":"L082","facility_name":"Sentry Storage Madison","unit_number":"00181"},{"facility_code":"L082","facility_name":"Sentry Storage Madison","unit_number":"00215"},{"facility_code":"L082","facility_name":"Sentry Storage Madison","unit_number":"00625"},{"facility_code":"L082","facility_name":"Sentry Storage Madison","unit_number":"00633"},{"facility_code":"L082","facility_name":"Sentry Storage Madison","unit_number":"00740"},{"facility_code":"L082","facility_name":"Sentry Storage Madison","unit_number":"00747"},{"facility_code":"L082","facility_name":"Sentry Storage Madison","unit_number":"00980"},{"facility_code":"L152","facility_name":"Spare Feet Self Storage - Abilene","unit_number":"29C"},{"facility_code":"L199","facility_name":"StorEZ- Scottsdale","unit_number":"1112"},{"facility_code":"L256","facility_name":"Storage Station","unit_number":"201"},{"facility_code":"L256","facility_name":"Storage Station","unit_number":"206"},{"facility_code":"L256","facility_name":"Storage Station","unit_number":"316"},{"facility_code":"L256","facility_name":"Storage Station","unit_number":"6093"},{"facility_code":"L256","facility_name":"Storage Station","unit_number":"6128"},{"facility_code":"L256","facility_name":"Storage Station","unit_number":"613"},{"facility_code":"L256","facility_name":"Storage Station","unit_number":"637"},{"facility_code":"L256","facility_name":"Storage Station","unit_number":"639"},{"facility_code":"L256","facility_name":"Storage Station","unit_number":"641"},{"facility_code":"L177","facility_name":"StorageMax - Yuma","unit_number":"222"},{"facility_code":"L177","facility_name":"StorageMax - Yuma","unit_number":"S421"},{"facility_code":"L177","facility_name":"StorageMax - Yuma","unit_number":"S918"},{"facility_code":"L388","facility_name":"Sunset Self Storage","unit_number":"034"},{"facility_code":"L409","facility_name":"Sure Thing! Self Storage - Toledo","unit_number":"2011"},{"facility_code":"L390","facility_name":"Tempe Self Storage","unit_number":"612"},{"facility_code":"L245","facility_name":"Thirty Pines Self Storage","unit_number":"142"},{"facility_code":"L245","facility_name":"Thirty Pines Self Storage","unit_number":"145"},{"facility_code":"L245","facility_name":"Thirty Pines Self Storage","unit_number":"147"},{"facility_code":"L245","facility_name":"Thirty Pines Self Storage","unit_number":"181"},{"facility_code":"L245","facility_name":"Thirty Pines Self Storage","unit_number":"316"},{"facility_code":"L245","facility_name":"Thirty Pines Self Storage","unit_number":"358"},{"facility_code":"L245","facility_name":"Thirty Pines Self Storage","unit_number":"550"},{"facility_code":"L245","facility_name":"Thirty Pines Self Storage","unit_number":"552"},{"facility_code":"L245","facility_name":"Thirty Pines Self Storage","unit_number":"623"},{"facility_code":"L245","facility_name":"Thirty Pines Self Storage","unit_number":"706"},{"facility_code":"L245","facility_name":"Thirty Pines Self Storage","unit_number":"815"},{"facility_code":"L245","facility_name":"Thirty Pines Self Storage","unit_number":"819"},{"facility_code":"L399","facility_name":"Thornydale Self Storage","unit_number":"M096"},{"facility_code":"L114","facility_name":"Tri-Village Self Storage - Louisville","unit_number":"1005"},{"facility_code":"L114","facility_name":"Tri-Village Self Storage - Louisville","unit_number":"2036"},{"facility_code":"L114","facility_name":"Tri-Village Self Storage - Louisville","unit_number":"2061"},{"facility_code":"L114","facility_name":"Tri-Village Self Storage - Louisville","unit_number":"4069"},{"facility_code":"L045","facility_name":"U Store It - Forest Hill","unit_number":"00922"},{"facility_code":"L333","facility_name":"Volcano Self Storage","unit_number":"A11"},{"facility_code":"L233","facility_name":"Western Mass Storage Solutions","unit_number":"211"},{"facility_code":"L233","facility_name":"Western Mass Storage Solutions","unit_number":"425"},{"facility_code":"L233","facility_name":"Western Mass Storage Solutions","unit_number":"806"},{"facility_code":"L422","facility_name":"Your Space Self Store - Tavares","unit_number":"3010"},{"facility_code":"L082","facility_name":"Sentry Storage Madison","unit_number":"01046"},{"facility_code":"L330","facility_name":"Ray Self Storage - Church St.","unit_number":"K101DD"}];

  const runPreload = async () => {
    if (!confirm(`This will insert ${PRELOAD_UNITS.length} units into the database. Any duplicates will be added again. Continue?`)) return;
    setSaving(true);
    let inserted = 0;
    let errors = 0;
    // Insert in batches of 20
    const batchSize = 20;
    for (let i = 0; i < PRELOAD_UNITS.length; i += batchSize) {
      const batch = PRELOAD_UNITS.slice(i, i + batchSize).map(u => ({
        facility_code: u.facility_code,
        facility_name: u.facility_name,
        unit_number: u.unit_number,
        note: "Preloaded — manager must log letter dates to begin process.",
        added_by: currentUser.email,
      }));
      try {
        const result = await sb("units", { method: "POST", body: JSON.stringify(batch) });
        inserted += result.length;
      } catch (e) {
        errors += batch.length;
        console.error("Batch insert error:", e);
      }
    }
    await loadUnits();
    setSaving(false);
    showToast(`Preload complete: ${inserted} units inserted${errors > 0 ? `, ${errors} errors` : ""}.`, errors > 0 ? "error" : "success");
  };

  // ── MODALS ──
  const renderModal = () => {
    if (!modal) return null;
    if (modal.type === "add_unit") return <AddUnitModal facilities={myFacilities} onAdd={addUnit} onClose={() => setModal(null)} saving={saving} />;
    if (modal.type === "log_letter1") return <Letter1Modal unit={modal.unit} onSave={logLetter1} onClose={() => setModal(null)} saving={saving} />;
    if (modal.type === "log_letter2") return <Letter2Modal unit={modal.unit} onSave={logLetter2} onClose={() => setModal(null)} saving={saving} />;
    if (modal.type === "dm_signoff") return <SignoffModal unit={modal.unit} onSave={dmSignoff} onClose={() => setModal(null)} saving={saving} />;
    if (modal.type === "view_unit") return <ViewUnitModal unit={modal.unit} fac={getFacility(modal.unit.facility_code)} currentUser={currentUser} onDelete={deleteUnit} onClose={() => setModal(null)} />;
    return null;
  };

  // ── UNIT ROW ──
  const UnitRow = ({ unit }) => {
    const status = getStatus(unit);
    const fac = getFacility(unit.facility_code);
    const canEdit = currentUser.role === "manager" || currentUser.role === "admin";
    const canSignoff = currentUser.role === "dm" || currentUser.role === "admin";
    const l2Due = unit.letter1_date ? addDays(unit.letter1_date, 32) : null;
    const signoffDue = unit.letter2_date ? addDays(unit.letter2_date, 32) : null;

    const nextAction = () => {
      if (status === "PENDING" && canEdit) return <Btn small onClick={() => setModal({ type: "log_letter1", unit })}>Log Letter 1</Btn>;
      if (status === "AWAITING_L2" && canEdit) return <Btn small variant="danger" onClick={() => setModal({ type: "log_letter2", unit })}>Log Letter 2 Now</Btn>;
      if (status === "AWAITING_L2_EARLY" && canEdit) return <Btn small variant="secondary" onClick={() => setModal({ type: "log_letter2", unit })}>Log Letter 2</Btn>;
      if (status === "AWAITING_SIGNOFF" && canSignoff) return <Btn small variant="success" onClick={() => setModal({ type: "dm_signoff", unit })}>Sign Off</Btn>;
      if (status === "AWAITING_SIGNOFF_EARLY" && canSignoff) return <Btn small variant="ghost" onClick={() => setModal({ type: "dm_signoff", unit })}>Sign Off Early</Btn>;
      return null;
    };

    return (
      <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
        <td style={{ padding: "12px 16px" }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#111827" }}>{unit.unit_number}</p>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>{unit.facility_name}</p>
        </td>
        <td style={{ padding: "12px 16px", fontSize: 12, color: "#6b7280" }}>{fac?.dmName || "—"}</td>
        <td style={{ padding: "12px 16px" }}><Badge status={status} /></td>
        <td style={{ padding: "12px 16px", fontSize: 12, color: "#6b7280" }}>
          {unit.letter1_date && <div>L1: {formatDate(unit.letter1_date)}</div>}
          {l2Due && !unit.letter2_date && <div style={{ color: today() >= l2Due ? "#dc2626" : "#6b7280" }}>L2 due: {formatDate(l2Due)}</div>}
          {unit.letter2_date && <div>L2: {formatDate(unit.letter2_date)}</div>}
          {signoffDue && !unit.dm_approved && <div style={{ color: today() >= signoffDue ? "#7c3aed" : "#6b7280" }}>Signoff due: {formatDate(signoffDue)}</div>}
        </td>
        <td style={{ padding: "12px 16px" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {nextAction()}
            <Btn small variant="ghost" onClick={() => setModal({ type: "view_unit", unit })}>View</Btn>
          </div>
        </td>
      </tr>
    );
  };

  // ── LOGIN SCREEN ──
  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "system-ui", color: "#6b7280" }}>Loading...</div>;

  if (!currentUser) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1e40af 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Georgia', serif" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: 40, width: "100%", maxWidth: 400, boxShadow: "0 25px 80px rgba(0,0,0,0.4)" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, background: "#1e40af", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 26 }}>📋</div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.5px" }}>Argus No Lease Tracker</h1>
            <p style={{ margin: "6px 0 0", fontSize: 14, color: "#6b7280", fontFamily: "system-ui" }}>Sign in to continue</p>
          </div>
          {dbError && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#dc2626" }}>⚠ Database connection error. Check Supabase credentials.</div>}
          <Field label="Email">
            <Input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} placeholder="your@email.com" />
          </Field>
          <Field label="Password">
            <Input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} placeholder="Password" />
          </Field>
          {loginErr && <p style={{ margin: "-8px 0 12px", fontSize: 13, color: "#dc2626" }}>{loginErr}</p>}
          <Btn onClick={login} style={{ width: "100%" }}>Sign In</Btn>
          <p style={{ margin: "16px 0 0", fontSize: 12, color: "#9ca3af", textAlign: "center", fontFamily: "system-ui" }}>Default password: <code>argus2024</code> · Admin: <code>admin123</code></p>
        </div>
      </div>
    );
  }

  const roleLabel = { admin: "L2L Admin", dm: "District Manager", manager: "Facility Manager" }[currentUser.role];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {toast && (
        <div style={{ position: "fixed", top: 16, right: 16, zIndex: 9999, background: toast.type === "error" ? "#dc2626" : "#059669", color: "#fff", padding: "12px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.2)", maxWidth: 380 }}>
          {toast.msg}
        </div>
      )}
      {saving && (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 9999, background: "#1e40af", color: "#fff", padding: "8px 20px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
          Saving...
        </div>
      )}

      <div style={{ background: "#0f172a", color: "#fff", padding: "0 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px" }}>📋 Argus No Lease Tracker</span>
            <div style={{ display: "flex", gap: 4 }}>
              {["dashboard", "units", ...(currentUser.role === "admin" ? ["admin"] : [])].map(v => (
                <button key={v} onClick={() => setView(v)} style={{ background: view === v ? "#1e40af" : "transparent", color: view === v ? "#fff" : "#94a3b8", border: "none", padding: "6px 14px", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>{v}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{currentUser.name}</p>
              <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>{roleLabel}</p>
            </div>
            <button onClick={logout} style={{ background: "#1e293b", color: "#94a3b8", border: "none", padding: "6px 12px", borderRadius: 7, fontSize: 12, cursor: "pointer" }}>Sign Out</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px" }}>

        {view === "dashboard" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>Overview</h2>
              <Btn variant="export" onClick={() => exportToExcel(myUnits, myFacilities)}>
                ⬇ Export to Excel
              </Btn>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 28 }}>
              {[
                { label: "Total Units", value: stats.total, color: "#1e40af", bg: "#eff6ff", statusKey: "ALL" },
                { label: "No Letter Sent", value: stats.pending, color: "#6b7280", bg: "#f9fafb", statusKey: "PENDING" },
                { label: "Send Letter 2", value: stats.needL2, color: "#dc2626", bg: "#fef2f2", statusKey: "AWAITING_L2" },
                { label: "Needs DM Sign-Off", value: stats.needSignoff, color: "#7c3aed", bg: "#f5f3ff", statusKey: "AWAITING_SIGNOFF" },
                { label: "Ready for Lien", value: stats.approved, color: "#059669", bg: "#ecfdf5", statusKey: "APPROVED" },
              ].map(s => (
                <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "18px 20px", cursor: "pointer" }} onClick={() => { setFilterStatus(s.statusKey); setView("units"); }}>
                  <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: s.color, fontWeight: 600 }}>{s.label}</p>
                </div>
              ))}
            </div>

            {(stats.needL2 > 0 || stats.needSignoff > 0) && (
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, marginBottom: 20 }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>🚨 Urgent Actions</h3>
                {myUnits.filter(u => ["AWAITING_L2", "AWAITING_SIGNOFF"].includes(getStatus(u))).slice(0, 8).map(unit => {
                  const s = getStatus(unit);
                  return (
                    <div key={unit.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
                      <div>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{unit.unit_number} — {unit.facility_name}</p>
                        <Badge status={s} />
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {s === "AWAITING_L2" && currentUser.role !== "dm" && <Btn small variant="danger" onClick={() => setModal({ type: "log_letter2", unit })}>Log Letter 2</Btn>}
                        {s === "AWAITING_SIGNOFF" && currentUser.role !== "manager" && <Btn small variant="success" onClick={() => setModal({ type: "dm_signoff", unit })}>Sign Off</Btn>}
                        <Btn small variant="ghost" onClick={() => setModal({ type: "view_unit", unit })}>View</Btn>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>All Tracked Units</h3>
                <div style={{ display: "flex", gap: 10 }}>
                  {(currentUser.role === "manager" || currentUser.role === "admin") && <Btn small onClick={() => setModal({ type: "add_unit" })}>+ Add Unit</Btn>}
                  <Btn small variant="secondary" onClick={() => setView("units")}>View All →</Btn>
                </div>
              </div>
              {myUnits.length === 0 ? (
                <p style={{ color: "#9ca3af", fontSize: 14, textAlign: "center", padding: "20px 0" }}>No units tracked yet.</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #f3f4f6" }}>
                        {["Unit / Facility", "DM", "Status", "Timeline", "Actions"].map(h => (
                          <th key={h} style={{ padding: "8px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>{myUnits.slice(0, 10).map(u => <UnitRow key={u.id} unit={u} />)}</tbody>
                  </table>
                  {myUnits.length > 10 && <p style={{ textAlign: "center", padding: "12px 0 0", fontSize: 13, color: "#6b7280" }}>Showing 10 of {myUnits.length}. <button onClick={() => setView("units")} style={{ background: "none", border: "none", color: "#1e40af", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>View all →</button></p>}
                </div>
              )}
            </div>
          </div>
        )}

        {view === "units" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>Units ({filteredUnits.length})</h2>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn variant="export" onClick={() => exportToExcel(myUnits, myFacilities)}>⬇ Export to Excel</Btn>
                {(currentUser.role === "manager" || currentUser.role === "admin") && <Btn onClick={() => setModal({ type: "add_unit" })}>+ Add Unit</Btn>}
              </div>
            </div>
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16, marginBottom: 16, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <Input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search unit # or facility..." style={{ maxWidth: 240 }} />
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: 7, fontSize: 14 }}>
                <option value="ALL">All Statuses</option>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <select value={filterFacility} onChange={e => setFilterFacility(e.target.value)} style={{ padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: 7, fontSize: 14, maxWidth: 280 }}>
                <option value="ALL">All Facilities</option>
                {myFacilities.map(f => <option key={f.code} value={f.code}>{f.name}</option>)}
              </select>
              {(filterStatus !== "ALL" || filterFacility !== "ALL" || searchQ) && <Btn small variant="ghost" onClick={() => { setFilterStatus("ALL"); setFilterFacility("ALL"); setSearchQ(""); }}>Clear</Btn>}
            </div>
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
              {filteredUnits.length === 0 ? (
                <p style={{ color: "#9ca3af", fontSize: 14, textAlign: "center", padding: "40px 0" }}>No units match your filters.</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #f3f4f6", background: "#f8fafc" }}>
                        {["Unit / Facility", "DM", "Status", "Timeline", "Actions"].map(h => (
                          <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>{filteredUnits.map(u => <UnitRow key={u.id} unit={u} />)}</tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {view === "admin" && currentUser.role === "admin" && (
          <div>
            <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 700, color: "#0f172a" }}>Admin</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
                <h3 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 700 }}>Quick Add Unit</h3>
                <Btn onClick={() => setModal({ type: "add_unit" })}>+ Add Unit to Any Facility</Btn>
              </div>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
                <h3 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 700 }}>Preload Units from Import</h3>
                <p style={{ margin: "0 0 12px", fontSize: 13, color: "#6b7280" }}>Insert {PRELOAD_UNITS.length} units from the initial no-lease report. Units will be visible immediately — managers must log their own letter dates.</p>
                <Btn variant="secondary" onClick={runPreload} disabled={saving}>⬆ ⬆ Run Preload ({PRELOAD_UNITS.length} units)</Btn>
              </div>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
                <h3 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 700 }}>Export Report</h3>
                <p style={{ margin: "0 0 12px", fontSize: 13, color: "#6b7280" }}>Download all units you have access to as a CSV, sorted by stage.</p>
                <Btn variant="export" onClick={() => exportToExcel(myUnits, myFacilities)}>⬇ Export to Excel (CSV)</Btn>
              </div>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
                <h3 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 700 }}>System Stats</h3>
                <p style={{ margin: "4px 0", fontSize: 13 }}>Total units tracked: <strong>{units.length}</strong></p>
                <p style={{ margin: "4px 0", fontSize: 13 }}>Total facilities: <strong>{FACILITIES_DATA.length}</strong></p>
                <p style={{ margin: "4px 0", fontSize: 13 }}>Approved for lien: <strong>{units.filter(u => getStatus(u) === "APPROVED").length}</strong></p>
                <p style={{ margin: "4px 0", fontSize: 13 }}>Database: <strong style={{ color: dbError ? "#dc2626" : "#059669" }}>{dbError ? "⚠ Error" : "✓ Connected"}</strong></p>
              </div>
            </div>
          </div>
        )}
      </div>

      {renderModal()}
    </div>
  );
}

// ── MODAL COMPONENTS ──

function AddUnitModal({ facilities, onAdd, onClose, saving }) {
  const [fCode, setFCode] = useState(facilities[0]?.code || "");
  const [uName, setUName] = useState("");
  const [note, setNote] = useState("");
  return (
    <Modal title="Add Unit to No Lease Tracker" onClose={onClose}>
      <Field label="Facility">
        <select value={fCode} onChange={e => setFCode(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: 7, fontSize: 14 }}>
          {facilities.map(f => <option key={f.code} value={f.code}>{f.name} ({f.code})</option>)}
        </select>
      </Field>
      <Field label="Unit Number / Name">
        <Input value={uName} onChange={e => setUName(e.target.value)} placeholder="e.g. 142, C27, H213" />
      </Field>
      <Field label="Notes" hint="Describe why this unit needs a no lease process">
        <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="Missing lease — tenant has been month-to-month since 2023..." style={{ width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: 7, fontSize: 14, boxSizing: "border-box", resize: "vertical" }} />
      </Field>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn onClick={() => onAdd({ facilityCode: fCode, unitName: uName, note })} disabled={!uName.trim() || saving}>Add Unit</Btn>
      </div>
    </Modal>
  );
}

function Letter1Modal({ unit, onSave, onClose, saving }) {
  const [date, setDate] = useState(today());
  return (
    <Modal title={`Log Letter 1 — Unit ${unit.unit_number}`} onClose={onClose}>
      <p style={{ margin: "0 0 16px", fontSize: 14, color: "#6b7280" }}>{unit.facility_name}</p>
      <Field label="Date Letter 1 Was Sent (via certified mail)" hint="Letter 2 can be logged on Day 32 or later from this date.">
        <Input type="date" value={date} onChange={e => setDate(e.target.value)} max={today()} />
      </Field>
      <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: 13, color: "#92400e", fontWeight: 600 }}>⚠ Important</p>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#92400e" }}>By logging this date, you confirm that Letter 1 was sent via certified mail on this date. Maintain physical records of the notice.</p>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn onClick={() => onSave(unit, date)} disabled={saving}>Confirm & Log Letter 1</Btn>
      </div>
    </Modal>
  );
}

function Letter2Modal({ unit, onSave, onClose, saving }) {
  const earliest = addDays(unit.letter1_date, 32);
  const [date, setDate] = useState(today() >= earliest ? today() : earliest);
  const tooEarly = date < earliest;
  return (
    <Modal title={`Log Letter 2 — Unit ${unit.unit_number}`} onClose={onClose}>
      <p style={{ margin: "0 0 16px", fontSize: 14, color: "#6b7280" }}>{unit.facility_name}</p>
      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: 13, color: "#166534" }}>Letter 1 was sent: <strong>{formatDate(unit.letter1_date)}</strong></p>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#166534" }}>Earliest valid date for Letter 2: <strong>{formatDate(earliest)}</strong></p>
      </div>
      <Field label="Date Letter 2 Was Sent (via certified mail)">
        <Input type="date" value={date} onChange={e => setDate(e.target.value)} max={today()} style={tooEarly ? { borderColor: "#ef4444" } : {}} />
        {tooEarly && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#dc2626", fontWeight: 600 }}>⛔ Too early. Must wait until {formatDate(earliest)}. Contact your DM.</p>}
      </Field>
      <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: 13, color: "#0c4a6e" }}>📁 Maintain physical records of this notice and provide copies directly to your DM for review.</p>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn onClick={() => onSave(unit, date)} disabled={tooEarly || saving}>Confirm & Log Letter 2</Btn>
      </div>
    </Modal>
  );
}

function SignoffModal({ unit, onSave, onClose, saving }) {
  const [confirmed, setConfirmed] = useState(false);
  const gap = unit.letter1_date && unit.letter2_date ? daysBetween(unit.letter1_date, unit.letter2_date) : 0;
  const gapOk = gap >= 30;
  return (
    <Modal title={`DM Sign-Off — Unit ${unit.unit_number}`} onClose={onClose}>
      <p style={{ margin: "0 0 16px", fontSize: 14, color: "#6b7280" }}>{unit.facility_name}</p>
      <div style={{ background: gapOk ? "#f0fdf4" : "#fef2f2", border: `1px solid ${gapOk ? "#bbf7d0" : "#fecaca"}`, borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: gapOk ? "#166534" : "#991b1b" }}>
          {gapOk ? "✓" : "⚠"} Gap between letters: <strong>{gap} days</strong> {gapOk ? "(meets 30-day minimum)" : "(BELOW 30-day minimum — do not sign off)"}
        </p>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>Letter 1: {formatDate(unit.letter1_date)} · Letter 2: {formatDate(unit.letter2_date)}</p>
      </div>
      <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: 13, color: "#0c4a6e" }}>📁 Verify that you have received physical copies of both notice records from the facility manager before signing off.</p>
      </div>
      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
          <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} style={{ marginTop: 2 }} />
          <span style={{ fontSize: 13, color: "#374151" }}>I have reviewed the physical notice records and confirm the letters were sent at least 30 days apart. I authorize this unit to proceed to the lien notice process.</span>
        </label>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn variant="success" onClick={() => onSave(unit, confirmed)} disabled={!confirmed || !gapOk || saving}>Approve & Sign Off</Btn>
      </div>
    </Modal>
  );
}

function ViewUnitModal({ unit, fac, currentUser, onDelete, onClose }) {
  const status = getStatus(unit);
  return (
    <Modal title={`Unit ${unit.unit_number} — ${unit.facility_name}`} onClose={onClose}>
      <div style={{ marginBottom: 16 }}><Badge status={status} /></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", marginBottom: 16 }}>
        {[["Facility", unit.facility_name], ["Unit #", unit.unit_number], ["DM", fac?.dmName], ["Manager", fac?.managerName || "—"], ["Added", formatDate(unit.created_at?.split("T")[0])]].map(([k, v]) => (
          <div key={k}><p style={{ margin: 0, fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>{k}</p><p style={{ margin: "2px 0 0", fontSize: 13, color: "#111827" }}>{v}</p></div>
        ))}
      </div>
      {unit.note && <div style={{ background: "#f9fafb", borderRadius: 8, padding: "10px 12px", marginBottom: 16 }}><p style={{ margin: 0, fontSize: 13, color: "#6b7280", fontStyle: "italic" }}>"{unit.note}"</p></div>}
      <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 12 }}>
        {unit.letter1_date && <p style={{ margin: "4px 0", fontSize: 13 }}><strong>Letter 1:</strong> {formatDate(unit.letter1_date)}{unit.letter1_logged_by ? ` — by ${unit.letter1_logged_by}` : ""}</p>}
        {unit.letter2_date && <p style={{ margin: "4px 0", fontSize: 13 }}><strong>Letter 2:</strong> {formatDate(unit.letter2_date)}{unit.letter2_logged_by ? ` — by ${unit.letter2_logged_by}` : ""}</p>}
        {unit.dm_approved && <p style={{ margin: "4px 0", fontSize: 13, color: "#059669", fontWeight: 600 }}>✓ DM Approved: {formatDate(unit.dm_approved_at?.split("T")[0])} by {unit.dm_approved_by}</p>}
      </div>
      {currentUser?.role === "admin" && (
        <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 12, marginTop: 8, display: "flex", justifyContent: "flex-end" }}>
          <Btn variant="danger" small onClick={() => { if (confirm("Delete this unit?")) onDelete(unit.id); }}>Delete Unit</Btn>
        </div>
      )}
    </Modal>
  );
}
