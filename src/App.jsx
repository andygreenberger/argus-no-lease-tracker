import { useState, useEffect, useCallback } from "react";
import { storage } from "./storage.js";

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
  if (!unit.letter1Date) return "PENDING";
  if (!unit.letter2Date) {
    const daysSince1 = daysBetween(unit.letter1Date, today());
    if (daysSince1 < 32) return "AWAITING_L2_EARLY";
    return "AWAITING_L2";
  }
  if (!unit.dmSignoff) {
    const daysSince2 = daysBetween(unit.letter2Date, today());
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

// ─── STORAGE KEY ─────────────────────────────────────────────────────────────
const STORAGE_KEY = "argus_no_lease_units_v1";
const USERS_KEY = "argus_users_v1";

const loadUnits = async () => {
  try { const r = await storage.get(STORAGE_KEY); return r ? JSON.parse(r.value) : []; } catch { return []; }
};
const saveUnits = async (units) => {
  try { await storage.set(STORAGE_KEY, JSON.stringify(units)); } catch (e) { console.error(e); }
};
const loadUsers = async () => {
  try { const r = await storage.get(USERS_KEY); return r ? JSON.parse(r.value) : null; } catch { return null; }
};
const saveUsers = async (users) => {
  try { await storage.set(USERS_KEY, JSON.stringify(users)); } catch (e) { console.error(e); }
};

// Build default users from facilities
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
  const [users, setUsers] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("dashboard"); // dashboard | units | admin
  const [modal, setModal] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterFacility, setFilterFacility] = useState("ALL");
  const [searchQ, setSearchQ] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    (async () => {
      let u = await loadUsers();
      if (!u) { u = buildDefaultUsers(); await saveUsers(u); }
      const uts = await loadUnits();
      setUsers(u);
      setUnits(uts);
      setLoading(false);
    })();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const login = () => {
    const u = users.find(x => x.email.toLowerCase() === loginEmail.toLowerCase() && x.password === loginPass);
    if (!u) { setLoginErr("Invalid email or password."); return; }
    setCurrentUser(u);
    setLoginErr("");
  };

  const logout = () => { setCurrentUser(null); setView("dashboard"); };

  // Facilities visible to current user
  const myFacilities = currentUser
    ? currentUser.role === "admin"
      ? FACILITIES_DATA
      : FACILITIES_DATA.filter(f => (currentUser.facilities || []).some(fc => fc.toLowerCase() === f.code.toLowerCase()))
    : [];

  const myFacilityCodes = new Set(myFacilities.map(f => f.code));

  const myUnits = units.filter(u => myFacilityCodes.has(u.facilityCode));

  const getFacility = (code) => FACILITIES_DATA.find(f => f.code === code);

  // Filtered units
  const filteredUnits = myUnits.filter(u => {
    const status = getStatus(u);
    if (filterStatus !== "ALL" && status !== filterStatus) return false;
    if (filterFacility !== "ALL" && u.facilityCode !== filterFacility) return false;
    if (searchQ) {
      const q = searchQ.toLowerCase();
      if (!u.unitName.toLowerCase().includes(q) && !u.facilityName.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Stats
  const stats = {
    total: myUnits.length,
    pending: myUnits.filter(u => getStatus(u) === "PENDING").length,
    needL2: myUnits.filter(u => getStatus(u) === "AWAITING_L2").length,
    needSignoff: myUnits.filter(u => getStatus(u) === "AWAITING_SIGNOFF").length,
    approved: myUnits.filter(u => getStatus(u) === "APPROVED").length,
  };

  // ── UNIT ACTIONS ──
  const saveAllUnits = async (newUnits) => { setUnits(newUnits); await saveUnits(newUnits); };

  const addUnit = async (data) => {
    const fac = getFacility(data.facilityCode);
    if (!fac) return;
    const newUnit = { id: Date.now().toString(), facilityCode: fac.code, facilityName: fac.name, unitName: data.unitName.trim(), note: data.note.trim(), letter1Date: null, letter2Date: null, dmSignoff: null, dmSignoffDate: null, addedBy: currentUser.email, addedAt: today(), isManual: true };
    await saveAllUnits([...units, newUnit]);
    showToast(`Unit ${data.unitName} added to ${fac.name}`);
    setModal(null);
  };

  const logLetter1 = async (unit, date) => {
    const updated = units.map(u => u.id === unit.id ? { ...u, letter1Date: date, letter1LoggedBy: currentUser.email } : u);
    await saveAllUnits(updated);
    showToast("Letter 1 date saved. Reminder scheduled for Day 32.");
    setModal(null);
  };

  const logLetter2 = async (unit, date, dropboxLink) => {
    if (daysBetween(unit.letter1Date, date) < 32) {
      showToast("ERROR: Letter 2 sent too early. Must be at least 32 days after Letter 1. Contact your DM.", "error");
      return;
    }
    const updated = units.map(u => u.id === unit.id ? { ...u, letter2Date: date, letter2DropboxLink: dropboxLink, letter2LoggedBy: currentUser.email } : u);
    await saveAllUnits(updated);
    showToast("Letter 2 logged. DM sign-off reminder scheduled for Day 32.");
    setModal(null);
  };

  const dmSignoff = async (unit, confirmed, dropboxLink1, dropboxLink2) => {
    if (!confirmed) return;
    const updated = units.map(u => u.id === unit.id ? { ...u, dmSignoff: true, dmSignoffDate: today(), dmSignoffBy: currentUser.email, letter1DropboxLink: dropboxLink1, letter2DropboxLinkDM: dropboxLink2 } : u);
    await saveAllUnits(updated);
    showToast("Sign-off complete. Unit approved for lien process.");
    setModal(null);
  };

  const deleteUnit = async (id) => {
    await saveAllUnits(units.filter(u => u.id !== id));
    showToast("Unit removed.");
    setModal(null);
  };

  const adminAddUnit = async (data) => {
    const fac = getFacility(data.facilityCode);
    if (!fac) return;
    const newUnit = { id: Date.now().toString(), facilityCode: fac.code, facilityName: fac.name, unitName: data.unitName.trim(), note: data.note.trim(), letter1Date: null, letter2Date: null, dmSignoff: null, dmSignoffDate: null, addedBy: "admin", addedAt: today(), isManual: false };
    await saveAllUnits([...units, newUnit]);
    showToast(`Unit added: ${fac.name} — ${data.unitName}`);
    setModal(null);
  };

  // ── MODAL RENDERS ──
  const renderModal = () => {
    if (!modal) return null;

    if (modal.type === "add_unit") {
      const [fCode, setFCode] = useState(myFacilities[0]?.code || "");
      const [uName, setUName] = useState("");
      const [note, setNote] = useState("");
      return (
        <Modal title="Add Unit to No Lease Tracker" onClose={() => setModal(null)}>
          <Field label="Facility">
            <select value={fCode} onChange={e => setFCode(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: 7, fontSize: 14 }}>
              {myFacilities.map(f => <option key={f.code} value={f.code}>{f.name} ({f.code})</option>)}
            </select>
          </Field>
          <Field label="Unit Number / Name">
            <Input value={uName} onChange={e => setUName(e.target.value)} placeholder="e.g. 142, C27, H213" />
          </Field>
          <Field label="Notes" hint="Describe why this unit needs a no lease process">
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="Missing lease — tenant has been month-to-month since 2023..." style={{ width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: 7, fontSize: 14, boxSizing: "border-box", resize: "vertical" }} />
          </Field>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={() => addUnit({ facilityCode: fCode, unitName: uName, note })} disabled={!uName.trim()}>Add Unit</Btn>
          </div>
        </Modal>
      );
    }

    if (modal.type === "log_letter1") {
      const unit = modal.unit;
      const [date, setDate] = useState(today());
      return (
        <Modal title={`Log Letter 1 — Unit ${unit.unitName}`} onClose={() => setModal(null)}>
          <p style={{ margin: "0 0 16px", fontSize: 14, color: "#6b7280" }}>{unit.facilityName}</p>
          <Field label="Date Letter 1 Was Sent (via certified mail)" hint="Letter 2 reminder will be sent on Day 32 from this date.">
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} max={today()} />
          </Field>
          <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 13, color: "#92400e", fontWeight: 600 }}>⚠ Important</p>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#92400e" }}>By logging this date, you are confirming that the No Lease Letter #1 was sent to the tenant via certified mail on the date entered above.</p>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={() => logLetter1(unit, date)}>Confirm & Log Letter 1</Btn>
          </div>
        </Modal>
      );
    }

    if (modal.type === "log_letter2") {
      const unit = modal.unit;
      const earliest = addDays(unit.letter1Date, 32);
      const [date, setDate] = useState(today() >= earliest ? today() : earliest);
      const [link, setLink] = useState("");
      const tooEarly = date < earliest;
      return (
        <Modal title={`Log Letter 2 — Unit ${unit.unitName}`} onClose={() => setModal(null)}>
          <p style={{ margin: "0 0 16px", fontSize: 14, color: "#6b7280" }}>{unit.facilityName}</p>
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 13, color: "#166534" }}>Letter 1 was sent: <strong>{formatDate(unit.letter1Date)}</strong></p>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#166534" }}>Earliest valid date for Letter 2: <strong>{formatDate(earliest)}</strong></p>
          </div>
          <Field label="Date Letter 2 Was Sent (via certified mail)">
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} max={today()} style={tooEarly ? { borderColor: "#ef4444" } : {}} />
            {tooEarly && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#dc2626", fontWeight: 600 }}>⛔ This date is less than 32 days after Letter 1. You must wait until {formatDate(earliest)}. Contact your DM immediately.</p>}
          </Field>
          <Field label="Dropbox Link — Certificate of Mailing (Letter 2)" hint="Upload the certificate to Dropbox and paste the share link here. Required.">
            <Input value={link} onChange={e => setLink(e.target.value)} placeholder="https://www.dropbox.com/..." />
          </Field>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={() => logLetter2(unit, date, link)} disabled={tooEarly || !link.trim()}>Confirm & Log Letter 2</Btn>
          </div>
        </Modal>
      );
    }

    if (modal.type === "dm_signoff") {
      const unit = modal.unit;
      const [link1, setLink1] = useState(unit.letter1DropboxLink || "");
      const [link2, setLink2] = useState(unit.letter2DropboxLink || unit.letter2DropboxLinkDM || "");
      const [confirmed, setConfirmed] = useState(false);
      const gap = unit.letter1Date && unit.letter2Date ? daysBetween(unit.letter1Date, unit.letter2Date) : 0;
      const gapOk = gap >= 30;
      return (
        <Modal title={`DM Sign-Off — Unit ${unit.unitName}`} onClose={() => setModal(null)}>
          <p style={{ margin: "0 0 16px", fontSize: 14, color: "#6b7280" }}>{unit.facilityName}</p>
          <div style={{ background: gapOk ? "#f0fdf4" : "#fef2f2", border: `1px solid ${gapOk ? "#bbf7d0" : "#fecaca"}`, borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: gapOk ? "#166534" : "#991b1b" }}>
              {gapOk ? "✓" : "⚠"} Gap between letters: <strong>{gap} days</strong> {gapOk ? "(meets 30-day minimum)" : "(BELOW 30-day minimum — do not sign off)"}
            </p>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>Letter 1: {formatDate(unit.letter1Date)} · Letter 2: {formatDate(unit.letter2Date)}</p>
          </div>
          <Field label="Dropbox Link — Certificate of Mailing (Letter 1)" hint="Verify this matches what was sent.">
            <Input value={link1} onChange={e => setLink1(e.target.value)} placeholder="https://www.dropbox.com/..." />
            {link1 && <a href={link1} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#1e40af", marginTop: 4, display: "inline-block" }}>Open Letter 1 Certificate ↗</a>}
          </Field>
          <Field label="Dropbox Link — Certificate of Mailing (Letter 2)">
            <Input value={link2} onChange={e => setLink2(e.target.value)} placeholder="https://www.dropbox.com/..." />
            {link2 && <a href={link2} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#1e40af", marginTop: 4, display: "inline-block" }}>Open Letter 2 Certificate ↗</a>}
          </Field>
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
            <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
              <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} style={{ marginTop: 2 }} />
              <span style={{ fontSize: 13, color: "#374151" }}>I have reviewed both certificates of mailing and confirm that the letters were sent at least 30 days apart with correct information. I authorize this unit to proceed to the lien notice process.</span>
            </label>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn variant="success" onClick={() => dmSignoff(unit, confirmed, link1, link2)} disabled={!confirmed || !gapOk}>Approve & Sign Off</Btn>
          </div>
        </Modal>
      );
    }

    if (modal.type === "view_unit") {
      const unit = modal.unit;
      const status = getStatus(unit);
      const fac = getFacility(unit.facilityCode);
      return (
        <Modal title={`Unit ${unit.unitName} — ${unit.facilityName}`} onClose={() => setModal(null)}>
          <div style={{ marginBottom: 16 }}><Badge status={status} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", marginBottom: 16 }}>
            {[["Facility", unit.facilityName], ["Unit #", unit.unitName], ["DM", fac?.dmName], ["Manager", fac?.managerName || "—"], ["Added", formatDate(unit.addedAt)], ["Days Overdue", unit.daysOverdue || "—"]].map(([k, v]) => (
              <div key={k}><p style={{ margin: 0, fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>{k}</p><p style={{ margin: "2px 0 0", fontSize: 13, color: "#111827" }}>{v}</p></div>
            ))}
          </div>
          {unit.note && <div style={{ background: "#f9fafb", borderRadius: 8, padding: "10px 12px", marginBottom: 16 }}><p style={{ margin: 0, fontSize: 13, color: "#6b7280", fontStyle: "italic" }}>"{unit.note}"</p></div>}
          <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 12 }}>
            {unit.letter1Date && <p style={{ margin: "4px 0", fontSize: 13 }}><strong>Letter 1:</strong> {formatDate(unit.letter1Date)} — by {unit.letter1LoggedBy}</p>}
            {unit.letter2Date && <p style={{ margin: "4px 0", fontSize: 13 }}><strong>Letter 2:</strong> {formatDate(unit.letter2Date)} — by {unit.letter2LoggedBy}</p>}
            {unit.letter2DropboxLink && <p style={{ margin: "4px 0", fontSize: 13 }}><a href={unit.letter2DropboxLink} target="_blank" rel="noreferrer" style={{ color: "#1e40af" }}>View L2 Certificate ↗</a></p>}
            {unit.dmSignoff && <p style={{ margin: "4px 0", fontSize: 13, color: "#059669", fontWeight: 600 }}>✓ DM Approved: {formatDate(unit.dmSignoffDate)} by {unit.dmSignoffBy}</p>}
          </div>
          {currentUser?.role === "admin" && (
            <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 12, marginTop: 8, display: "flex", justifyContent: "flex-end" }}>
              <Btn variant="danger" small onClick={() => { if (confirm("Delete this unit?")) deleteUnit(unit.id); }}>Delete Unit</Btn>
            </div>
          )}
        </Modal>
      );
    }

    if (modal.type === "admin_add_unit") {
      const [fCode, setFCode] = useState(FACILITIES_DATA[0]?.code || "");
      const [uName, setUName] = useState("");
      const [note, setNote] = useState("");
      return (
        <Modal title="Admin: Add Unit" onClose={() => setModal(null)}>
          <Field label="Facility">
            <select value={fCode} onChange={e => setFCode(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: 7, fontSize: 14 }}>
              {FACILITIES_DATA.map(f => <option key={f.code} value={f.code}>{f.name} ({f.code})</option>)}
            </select>
          </Field>
          <Field label="Unit Number">
            <Input value={uName} onChange={e => setUName(e.target.value)} placeholder="Unit #" />
          </Field>
          <Field label="Notes">
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Missing lease, reason..." style={{ width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: 7, fontSize: 14, boxSizing: "border-box" }} />
          </Field>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn onClick={() => adminAddUnit({ facilityCode: fCode, unitName: uName, note })} disabled={!uName.trim()}>Add Unit</Btn>
          </div>
        </Modal>
      );
    }

    return null;
  };

  // ── UNIT ROW ──
  const UnitRow = ({ unit }) => {
    const status = getStatus(unit);
    const fac = getFacility(unit.facilityCode);
    const canEdit = currentUser.role === "manager" || currentUser.role === "admin";
    const canSignoff = currentUser.role === "dm" || currentUser.role === "admin";

    const nextAction = () => {
      if (status === "PENDING" && canEdit) return <Btn small onClick={() => setModal({ type: "log_letter1", unit })}>Log Letter 1</Btn>;
      if (status === "AWAITING_L2" && canEdit) return <Btn small variant="danger" onClick={() => setModal({ type: "log_letter2", unit })}>Log Letter 2 Now</Btn>;
      if (status === "AWAITING_L2_EARLY" && canEdit) return <Btn small variant="secondary" onClick={() => setModal({ type: "log_letter2", unit })}>Log Letter 2</Btn>;
      if (status === "AWAITING_SIGNOFF" && canSignoff) return <Btn small variant="success" onClick={() => setModal({ type: "dm_signoff", unit })}>Sign Off</Btn>;
      if (status === "AWAITING_SIGNOFF_EARLY" && canSignoff) return <Btn small variant="ghost" onClick={() => setModal({ type: "dm_signoff", unit })}>Sign Off Early</Btn>;
      return null;
    };

    const l2Due = unit.letter1Date ? addDays(unit.letter1Date, 32) : null;
    const signoffDue = unit.letter2Date ? addDays(unit.letter2Date, 32) : null;

    return (
      <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
        <td style={{ padding: "12px 16px" }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#111827" }}>{unit.unitName}</p>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>{unit.facilityName}</p>
        </td>
        <td style={{ padding: "12px 16px", fontSize: 12, color: "#6b7280" }}>{fac?.dmName || "—"}</td>
        <td style={{ padding: "12px 16px" }}><Badge status={status} /></td>
        <td style={{ padding: "12px 16px", fontSize: 12, color: "#6b7280" }}>
          {unit.letter1Date && <div>L1: {formatDate(unit.letter1Date)}</div>}
          {l2Due && !unit.letter2Date && <div style={{ color: today() >= l2Due ? "#dc2626" : "#6b7280" }}>L2 due: {formatDate(l2Due)}</div>}
          {unit.letter2Date && <div>L2: {formatDate(unit.letter2Date)}</div>}
          {signoffDue && !unit.dmSignoff && <div style={{ color: today() >= signoffDue ? "#7c3aed" : "#6b7280" }}>Signoff due: {formatDate(signoffDue)}</div>}
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

  // ── MAIN LAYOUT ──
  const roleLabel = { admin: "L2L Admin", dm: "District Manager", manager: "Facility Manager" }[currentUser.role];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 16, right: 16, zIndex: 9999, background: toast.type === "error" ? "#dc2626" : "#059669", color: "#fff", padding: "12px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.2)", maxWidth: 380 }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
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

        {/* ── DASHBOARD ── */}
        {view === "dashboard" && (
          <div>
            <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 700, color: "#0f172a" }}>Overview</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 28 }}>
              {[
                { label: "Total Units", value: stats.total, color: "#1e40af", bg: "#eff6ff" },
                { label: "No Letter Sent", value: stats.pending, color: "#6b7280", bg: "#f9fafb" },
                { label: "Send Letter 2", value: stats.needL2, color: "#dc2626", bg: "#fef2f2" },
                { label: "Needs DM Sign-Off", value: stats.needSignoff, color: "#7c3aed", bg: "#f5f3ff" },
                { label: "Ready for Lien", value: stats.approved, color: "#059669", bg: "#ecfdf5" },
              ].map(s => (
                <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "18px 20px", cursor: "pointer" }} onClick={() => { setFilterStatus(s.label === "Total Units" ? "ALL" : Object.entries(STATUS_CONFIG).find(([, v]) => v.label === s.label)?.[0] || "ALL"); setView("units"); }}>
                  <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: s.color, fontWeight: 600 }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Urgent actions */}
            {(stats.needL2 > 0 || stats.needSignoff > 0) && (
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, marginBottom: 20 }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>🚨 Urgent Actions</h3>
                {myUnits.filter(u => ["AWAITING_L2", "AWAITING_SIGNOFF"].includes(getStatus(u))).slice(0, 8).map(unit => {
                  const s = getStatus(unit);
                  return (
                    <div key={unit.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
                      <div>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{unit.unitName} — {unit.facilityName}</p>
                        <Badge status={s} />
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {s === "AWAITING_L2" && (currentUser.role !== "dm") && <Btn small variant="danger" onClick={() => setModal({ type: "log_letter2", unit })}>Log Letter 2</Btn>}
                        {s === "AWAITING_SIGNOFF" && (currentUser.role !== "manager") && <Btn small variant="success" onClick={() => setModal({ type: "dm_signoff", unit })}>Sign Off</Btn>}
                        <Btn small variant="ghost" onClick={() => setModal({ type: "view_unit", unit })}>View</Btn>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Recent activity */}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>All Tracked Units</h3>
                <div style={{ display: "flex", gap: 10 }}>
                  {(currentUser.role === "manager" || currentUser.role === "admin") && <Btn small onClick={() => setModal({ type: "add_unit" })}>+ Add Unit</Btn>}
                  <Btn small variant="secondary" onClick={() => setView("units")}>View All →</Btn>
                </div>
              </div>
              {myUnits.length === 0 ? (
                <p style={{ color: "#9ca3af", fontSize: 14, textAlign: "center", padding: "20px 0" }}>No units tracked yet. Add a unit to begin the No Lease process.</p>
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
                    <tbody>
                      {myUnits.slice(0, 10).map(u => <UnitRow key={u.id} unit={u} />)}
                    </tbody>
                  </table>
                  {myUnits.length > 10 && <p style={{ textAlign: "center", padding: "12px 0 0", fontSize: 13, color: "#6b7280" }}>Showing 10 of {myUnits.length}. <button onClick={() => setView("units")} style={{ background: "none", border: "none", color: "#1e40af", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>View all →</button></p>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── UNITS VIEW ── */}
        {view === "units" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>Units ({filteredUnits.length})</h2>
              {(currentUser.role === "manager" || currentUser.role === "admin") && <Btn onClick={() => setModal({ type: "add_unit" })}>+ Add Unit</Btn>}
            </div>
            {/* Filters */}
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
                    <tbody>
                      {filteredUnits.map(u => <UnitRow key={u.id} unit={u} />)}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ADMIN VIEW ── */}
        {view === "admin" && currentUser.role === "admin" && (
          <div>
            <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 700, color: "#0f172a" }}>Admin</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>Quick Add Unit</h3>
                <Btn onClick={() => setModal({ type: "admin_add_unit" })}>+ Add Unit to Any Facility</Btn>
                <p style={{ margin: "12px 0 0", fontSize: 13, color: "#6b7280" }}>Use this to pre-load units from your Argus report or add units on behalf of a facility.</p>
              </div>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>System Stats</h3>
                <p style={{ margin: "4px 0", fontSize: 13 }}>Total units tracked: <strong>{units.length}</strong></p>
                <p style={{ margin: "4px 0", fontSize: 13 }}>Total facilities: <strong>{FACILITIES_DATA.length}</strong></p>
                <p style={{ margin: "4px 0", fontSize: 13 }}>Total users: <strong>{users.length}</strong></p>
                <p style={{ margin: "4px 0", fontSize: 13 }}>Approved for lien: <strong>{units.filter(u => getStatus(u) === "APPROVED").length}</strong></p>
              </div>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, gridColumn: "1 / -1" }}>
                <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>Email Reminder Logic</h3>
                <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.8 }}>
                  <p style={{ margin: "0 0 8px" }}>The following reminders are automatically triggered (requires email service integration — see deployment guide):</p>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    <li><strong>Day 32 after Letter 1:</strong> Email to Manager (CC: DM, CC: andy@late2lien.net) — "Time to send Letter 2"</li>
                    <li><strong>Day 32 after Letter 2:</strong> Email to DM (CC: Manager, CC: andy@late2lien.net) — "No Lease process complete — sign-off required"</li>
                    <li><strong>After DM Sign-Off:</strong> Email to Manager (CC: DM, CC: andy@late2lien.net) — "Unit approved — proceed with lien notice"</li>
                    <li><strong>Overdue alerts:</strong> If Letter 2 not logged by Day 40, escalation email to DM + andy@late2lien.net</li>
                  </ul>
                </div>
              </div>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, gridColumn: "1 / -1" }}>
                <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700 }}>Deployment Guide</h3>
                <p style={{ margin: "0 0 12px", fontSize: 13, color: "#6b7280" }}>To deploy this as a live web app with real email reminders:</p>
                <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: "#374151", lineHeight: 2 }}>
                  <li>Export this .jsx file and deploy to <strong>Vercel</strong> (free) as a React app</li>
                  <li>Replace the in-memory storage with <strong>Supabase</strong> (free tier) for persistent data</li>
                  <li>Create a <strong>Resend</strong> account (free, 3k emails/month) for automated email reminders</li>
                  <li>Add a <strong>Vercel Cron Job</strong> that runs daily, checks all units for Day 32 triggers, and sends emails via Resend</li>
                  <li>Set up a <strong>Dropbox App</strong> (dropbox.com/developers) and add the API token to enable auto-upload of certificates</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>

      {renderModal()}
    </div>
  );
}
