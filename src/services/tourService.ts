import {supabase} from '../services/supabase';
import {Tour, TourImagen} from '../types/TourType';

export const tourService = {

	//Añadir nuevo tour
	async crear(tour: Omit<Tour, 'id' | 'created_at'>): Promise<Tour> {
		try {
			const {data, error} = await supabase
				.from('tours')
				.insert([tour])
				.select()
				.single();

			if (error) throw error;
			return data;
		} catch (error) {
			console.error('Error creando tour:', error);
			throw new Error('No se pudo crear el tour');
		}
	},

	async getAllTours(): Promise<{data: Tour[] | null; error: any}> {
		const {data, error} = await supabase
			.from('tours')
			.select('*')
			.order('created_at', {ascending: false});
		return {data, error};
	},

	//Obtener un tour por ID
	async obtenerPorId(id: string): Promise<Tour | null> {
		const {data, error} = await supabase
			.from('tours')
			.select('*')
			.eq('id', id)
			.single();
		if (error) return null;
		return data;
	},

	//Modificar tour existente
	async actualizar(
		id_tour: string,
		tour: Partial<Omit<Tour, 'id'>>,
	): Promise<Tour> {
		try {
			const {data, error} = await supabase
				.from('tours')
				.update(tour)
				.eq('id', id_tour)
				.select()
				.single();

			if (error) {
				console.error('Error de Supabase:', error);
				throw error;
			}

			console.log('Tour actualizado:', data);
			return data;
		} catch (error) {
			console.error('Error actualizando tour:', error);
			throw new Error('No se pudo actualizar el tour');
		}
	},

	//Borrar tour
	async eliminar(id_tour: string): Promise<void> {
		try {
			const {error} = await supabase.from('tours').delete().eq('id', id_tour);

			if (error) {
				console.error('Error de Supabase:', error);
				throw error;
			}

			console.log('Tour eliminado:', id_tour);
		} catch (error) {
			console.error('Error eliminando tour:', error);
			throw new Error('No se pudo eliminar el tour');
		}
	},

    async getTourById(id: string) {
        return this.obtenerPorId(id);
    }
};

export const tourImagenService = {

	//Añadir imagenes a un tour
	async crear(imagenes: Omit<TourImagen, 'id'>[]): Promise<TourImagen[]> {
		try {
			const {data, error} = await supabase
				.from('tour_imagenes')
				.insert(imagenes)
				.select();

			if (error) {
				console.error('Error de Supabase:', error);
				throw error;
			}

			console.log(`${data?.length || 0} imágenes creadas`);
			return data || [];
		} catch (error) {
			console.error('Error creando imágenes:', error);
			throw new Error('No se pudieron crear las imágenes');
		}
	},

	//Obtener todas las imágenes de un tour
	async obtenerPorTour(id_tour: string): Promise<TourImagen[]> {
		try {
			const {data, error} = await supabase
				.from('tour_imagenes')
				.select('*')
				.eq('idtour', id_tour);

			if (error) {
				console.error('Error de Supabase:', error);
				return [];
			}

			return data || [];
		} catch (error) {
			console.error('Error obteniendo imágenes:', error);
			return [];
		}
	},

	//Borrar una imagen específica
	async eliminar(id: string): Promise<void> {
		try {
			const {error} = await supabase
				.from('tour_imagenes')
				.delete()
				.eq('id', id);

			if (error) {
				console.error('Error de Supabase:', error);
				throw error;
			}

			console.log('Imagen eliminada:', id);
		} catch (error) {
			console.error('Error eliminando imagen:', error);
			throw new Error('No se pudo eliminar la imagen');
		}
	},


	//Borrar todas las imágenes de un tour
	async eliminarPorTour(id_tour: string): Promise<void> {
		try {
			const {error} = await supabase
				.from('tour_imagenes')
				.delete()
				.eq('idtour', id_tour);

			if (error) {
				console.error('Error de Supabase:', error);
				throw error;
			}

			console.log(`Todas las imágenes eliminadas para tour ${id_tour}`);
		} catch (error) {
			console.error('Error eliminando imágenes del tour:', error);
			throw new Error('No se pudieron eliminar las imágenes');
		}
	},
};
